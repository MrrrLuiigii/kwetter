import { BadRequestException, QueryParams } from "@kwetter/models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Kweet from "./kweet.entity";

@Injectable()
export class KweetService {
	constructor(
		@InjectRepository(Kweet)
		private kweetRepository: Repository<Kweet>
	) {}

	public async postKweet(kweet: Kweet) {
		return await this.kweetRepository.save(kweet);
	}

	public async getByProfileId(id: string, pagination: QueryParams) {
		const [data, count] = await this.kweetRepository.findAndCount({
			where: { profileId: id },
			order: { createdAt: "DESC" },
			take: pagination.take,
			skip: pagination.skip
		});
		return { data, count };
	}

	public async getAndDeleteByProfileId(profileId: string) {
		const kweets = await this.kweetRepository.find({ where: { profileId } });
		await this.kweetRepository.delete({ profileId });
		return kweets;
	}

	public async getById(id: string) {
		return await this.kweetRepository.findOne(id);
	}

	public async getFeed(ids: string[], pagination: QueryParams) {
		const kweetObjects: Kweet[] = [];
		ids.forEach((id: string) => {
			const kweet = new Kweet();
			kweet.profileId = id;
			kweetObjects.push(kweet);
		});

		const [data, count] = await this.kweetRepository.findAndCount({
			where: kweetObjects,
			order: { createdAt: "DESC" },
			take: pagination.take,
			skip: pagination.skip
		});
		return { data, count };
	}

	public async addLike(kweetId: string) {
		return await this.kweetRepository
			.createQueryBuilder()
			.update(Kweet)
			.set({ likes: () => "likes + 1" })
			.where("id = :id", { id: kweetId })
			.execute();
	}

	public async removeLike(kweetId: string) {
		const kweet = await this.kweetRepository.findOne(kweetId);
		if (kweet)
			return await this.kweetRepository.update(kweetId, {
				likes: kweet.likes - 1 > 0 ? kweet.likes - 1 : 0
			});
		return;
	}

	public async deleteKweet(id: string) {
		return await this.kweetRepository.delete(id);
	}
}
