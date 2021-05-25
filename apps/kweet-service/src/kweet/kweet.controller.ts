import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Headers,
	HttpCode,
	Query
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

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
	BadRequestException
} from "@kwetter/models";
import {
	AxiosFollowService,
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
			kweetVMs.push(
				new KweetVM(data[i] as KweetType, profile.username, trends)
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
			kweetVMs.push(new KweetVM(data[i] as KweetType, username, trends));
		}

		return { data: kweetVMs, count };
	}
}
