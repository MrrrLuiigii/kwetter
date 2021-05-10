import {
	DecodedToken,
	FollowRequest,
	FollowVM,
	ProfileMinVM,
	ProfileType
} from "@kwetter/models";
import {
	Headers,
	Body,
	Controller,
	Get,
	HttpCode,
	Inject,
	Post,
	Delete,
	Param
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//follow
import Follow from "./follow.entity";
import { FollowService } from "./follow.service";

//libs
import { AxiosProfileService } from "@kwetter/services";

@Controller("follow")
export class FollowController {
	constructor(
		private readonly followService: FollowService,
		private readonly axiosProfileService: AxiosProfileService,
		@Inject("FOLLOW_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	@HttpCode(200)
	async follow(
		@Headers("decoded") decoded: DecodedToken,
		@Body() followRequest: FollowRequest
	) {
		let follow: Follow = {
			profileId: followRequest.followId,
			followerId: followRequest.profileId
		};

		follow = await this.followService.follow(follow);

		return new ProfileMinVM(
			await this.axiosProfileService.getMinimalProfileById(
				follow.profileId,
				decoded.token
			)
		);
	}

	@Delete()
	async unfollow(
		@Headers("decoded") decoded: DecodedToken,
		@Body() unfollowRequest: FollowRequest
	) {
		let unfollow: Follow = {
			profileId: unfollowRequest.followId,
			followerId: unfollowRequest.profileId
		};

		return await this.followService.unfollow(unfollow);
	}

	@Get(":id")
	async getFollowByProfileId(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string
	) {
		const follows = await this.followService.getFollowByProfileId(id);

		let followerIds: string[] = [];
		let followers = [];
		if (follows.followers.length > 0) {
			followerIds = follows.followers.map((f) => f.followerId);
			followers = await this.axiosProfileService.getMinimalProfilesByIds(
				followerIds,
				decoded.token
			);
		}

		let followingIds: string[] = [];
		let following = [];
		if (follows.isFollowing.length > 0) {
			followingIds = follows.isFollowing.map((f) => f.profileId);
			following = await this.axiosProfileService.getMinimalProfilesByIds(
				followingIds,
				decoded.token
			);
		}

		return new FollowVM(followers, following);
	}
}
