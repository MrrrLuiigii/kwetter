import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Inject,
	Param,
	Post
} from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";

//like
import Like from "./like.entity";
import { LikeService } from "./like.service";

//libs
import {
	BadRequestException,
	InternalServerException,
	LikeKweetRequest,
	LikeType,
	LikeVM,
	ProfileType
} from "@kwetter/models";

@Controller("like")
export class LikeController {
	constructor(
		private readonly likeService: LikeService,
		@Inject("LIKE_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	@HttpCode(200)
	async likeKweet(@Body() likeKweetRequest: LikeKweetRequest) {
		let like: Like = {
			...likeKweetRequest,
			createdAt: new Date(new Date().getTime() + 0 * 60 * 60 * 1000)
		};

		await this.likeService
			.likeKweet(like)
			.then(() => {
				this.client
					.send<string, string>("KWEET_LIKED", likeKweetRequest.kweetId)
					.toPromise()
					.catch(() => {});
			})
			.catch((err: { code: string }) => {
				if (err.code === "ER_DUP_ENTRY")
					throw new BadRequestException("You have already liked this Kweet...");
				throw new InternalServerException();
			});

		return this.getLikeVMs(
			await this.likeService.getLikesByKweet(like.kweetId)
		);
	}

	@Delete()
	async unlikeKweet(@Body() unlikeKweetRequest: LikeKweetRequest) {
		let like: Like = {
			...unlikeKweetRequest,
			createdAt: new Date(new Date().getTime() + 0 * 60 * 60 * 1000)
		};

		await this.likeService
			.unlikeKweet(like)
			.then(() => {
				this.client
					.send<string, string>("KWEET_UNLIKED", unlikeKweetRequest.kweetId)
					.toPromise()
					.catch(() => {});
			})
			.catch(() => {
				throw new InternalServerException();
			});

		return this.getLikeVMs(
			await this.likeService.getLikesByKweet(like.kweetId)
		);
	}

	@Get("kweet/:id")
	async getLikesByKweet(@Param("id") kweetId: string) {
		return this.getLikeVMs(await this.likeService.getLikesByKweet(kweetId));
	}

	private getLikeVMs(likes: Like[]) {
		const likeVMs: LikeVM[] = [];
		likes.forEach((like) => likeVMs.push(new LikeVM(like as LikeType)));
		return likeVMs;
	}

	@MessagePattern("KWEET_DELETED")
	async kweetDeleted(@Payload() message: string) {
		return await this.likeService.kweetDeleted(message);
	}

	@MessagePattern("PROFILE_DELETED")
	async profileDeleted(@Payload() message: ProfileType) {
		return await this.likeService.profileDeleted(message.id);
	}
}
