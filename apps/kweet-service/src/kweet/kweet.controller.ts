import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Headers,
	HttpCode,
	Query,
	Delete
} from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";

//kweet
import Kweet from "./kweet.entity";
import { KweetService } from "./kweet.service";

//libs
import {
	DecodedToken,
	PostKweetRequest,
	KweetVM,
	KweetType,
	QueryParams,
	TrendType,
	ProfileMinVM,
	BadRequestException,
	InternalServerException,
	UnauthorizedException,
	ProfileType
} from "@kwetter/models";
import {
	AxiosFollowService,
	AxiosLikeService,
	AxiosProfileService,
	AxiosTrendService
} from "@kwetter/services";

@Controller("kweet")
export class KweetController {
	constructor(
		private readonly kweetService: KweetService,
		private readonly axiosProfileService: AxiosProfileService,
		private readonly axiosTrendService: AxiosTrendService,
		private readonly axiosFollowService: AxiosFollowService,
		private readonly axiosLikeService: AxiosLikeService,
		@Inject("KWEET_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	@HttpCode(200)
	async postKweet(
		@Headers("decoded") decoded: DecodedToken,
		@Body() postKweetRequest: PostKweetRequest
	) {
		let kweet: Kweet = {
			...postKweetRequest,
			createdAt: new Date(new Date().getTime() + 0 * 60 * 60 * 1000)
		};

		for (let i = 0; i < kweet.mentions.length; i++) {
			await this.axiosProfileService
				.getProfileByUsername(kweet.mentions[i].substring(1), decoded.token)
				.catch((err: any) => {
					throw new BadRequestException(
						`User with username ${kweet.mentions[i].substring(
							1
						)} does not exist...`
					);
				});
		}

		const trends = await this.axiosTrendService.postAndGetTrendIds(
			postKweetRequest.trends,
			decoded.token
		);

		kweet.trends = trends.map((trend: TrendType) => trend.id);
		return new KweetVM(
			(await this.kweetService.postKweet(kweet)) as KweetType,
			decoded.username,
			trends
		);
	}

	@Delete(":id")
	async deleteKweet(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string
	) {
		const kweet = await this.kweetService.getById(id);
		if (!kweet) {
			throw new BadRequestException(`Kweet with id ${id} does not exist...`);
		}

		const profile = await this.axiosProfileService.getProfileByAuthId(
			decoded.token
		);
		if (!profile || profile.id !== kweet.profileId) {
			throw new UnauthorizedException("You can only delete your own kweets...");
		}

		await this.kweetService
			.deleteKweet(kweet.id)
			.then(() => {
				this.client
					.send<string, string>("KWEET_DELETED", kweet.id)
					.toPromise()
					.catch(() => {});
			})
			.catch(() => {
				throw new InternalServerException();
			});
		return kweet;
	}

	@Get(":id")
	async getKweetsByProfileId(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string,
		@Query() query: QueryParams = { skip: 0, take: 10 }
	) {
		const { data, count } = await this.kweetService.getByProfileId(id, {
			skip: query.skip,
			take: query.take
		});

		const profile = await this.axiosProfileService.getMinimalProfileById(
			id,
			decoded.token
		);

		const kweetVMs: KweetVM[] = [];
		for (let i = 0; i < data.length; i++) {
			let trends = [];
			if (data[i].trends.length > 0)
				trends = await this.axiosTrendService.getTrends(
					data[i].trends,
					decoded.token
				);

			const likes = await this.axiosLikeService.getLikesByKweet(
				data[i].id,
				decoded.token
			);

			kweetVMs.push(
				new KweetVM(data[i] as KweetType, profile.username, trends, likes)
			);
		}

		return { data: kweetVMs, count };
	}

	@Get("feed/:id")
	async getKweetsFeed(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string,
		@Query() query: QueryParams = { skip: 0, take: 10 }
	) {
		const { following } = await this.axiosFollowService.getFollowsByProfileId(
			id,
			decoded.token
		);

		if (following.length === 0) return { data: [], count: 0 };
		const ids = following.map((f: ProfileMinVM) => f.id);

		const { data, count } = await this.kweetService.getFeed(ids, {
			skip: query.skip,
			take: query.take
		});

		const kweetVMs: KweetVM[] = [];
		for (let i = 0; i < data.length; i++) {
			let trends = [];
			if (data[i].trends.length > 0)
				trends = await this.axiosTrendService.getTrends(
					data[i].trends,
					decoded.token
				);

			const username: string = following.find(
				(f: ProfileMinVM) => f.id === data[i].profileId
			).username;

			const likes = await this.axiosLikeService.getLikesByKweet(
				data[i].id,
				decoded.token
			);

			kweetVMs.push(new KweetVM(data[i] as KweetType, username, trends, likes));
		}

		return { data: kweetVMs, count };
	}

	@Get("mention/:mention")
	async getKweetsByMention(
		@Headers("decoded") decoded: DecodedToken,
		@Param("mention") mention: string,
		@Query() query: QueryParams = { skip: 0, take: 10 }
	) {
		return this.kweetService.getByMention(mention, query);
	}

	@MessagePattern("KWEET_LIKED")
	async kweetLiked(@Payload() message: string) {
		return await this.kweetService.addLike(message);
	}

	@MessagePattern("KWEET_UNLIKED")
	async kweetUnliked(@Payload() message: string) {
		return await this.kweetService.removeLike(message);
	}

	@MessagePattern("PROFILE_DELETED")
	async profileDeleted(@Payload() message: ProfileType) {
		const kweets = await this.kweetService.getAndDeleteByProfileId(message.id);
		kweets.forEach((kweet) => {
			this.client
				.send<string, string>("KWEET_DELETED", kweet.id)
				.toPromise()
				.catch(() => {});
		});
		return kweets;
	}
}
