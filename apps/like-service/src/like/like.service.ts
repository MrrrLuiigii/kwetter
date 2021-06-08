import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Like from "./like.entity";

@Injectable()
export class LikeService {
	constructor(
		@InjectRepository(Like)
		private likeRepository: Repository<Like>
	) {}

	public async likeKweet(like: Like) {
		return await this.likeRepository.save(like);
	}

	public async unlikeKweet(like: Like) {
		return await this.likeRepository.delete({
			kweetId: like.kweetId,
			profileId: like.profileId
		});
	}

	public async getLikesByKweet(kweetId: string) {
		return await this.likeRepository.find({ where: { kweetId } });
	}

	public async kweetDeleted(kweetId: string) {
		return await this.likeRepository.delete({ kweetId });
	}

	public async profileDeleted(profileId: string) {
		return await this.likeRepository.delete({ profileId });
	}
}
