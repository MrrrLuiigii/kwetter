import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Follow from "./follow.entity";

@Injectable()
export class FollowService {
	constructor(
		@InjectRepository(Follow)
		private followRepository: Repository<Follow>
	) {}

	public async follow(follow: Follow) {
		return await this.followRepository.save(follow);
	}

	public async unfollow(unfollow: Follow) {
		await this.followRepository.delete(unfollow);
		return unfollow;
	}

	public async getFollowByProfileId(profileId: string) {
		return {
			isFollowing: await this.followRepository.find({
				where: { followerId: profileId }
			}),
			followers: await this.followRepository.find({ where: { profileId } })
		};
	}
}
