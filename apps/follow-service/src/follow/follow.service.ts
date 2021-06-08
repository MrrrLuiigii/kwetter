import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { profile } from "node:console";
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

	public async isFollowing(
		profileId: string,
		followingId: string
	): Promise<boolean> {
		return (await this.followRepository.findOne({
			where: { followerId: profileId, profileId: followingId }
		}))
			? true
			: false;
	}

	public async deleteProfileFollows(profileId: string) {
		return await this.followRepository
			.createQueryBuilder()
			.delete()
			.from(Follow)
			.where("profileId = :id", { id: profileId })
			.orWhere("followerId = :id", { id: profileId })
			.execute();
	}
}
