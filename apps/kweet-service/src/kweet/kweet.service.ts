import { QueryParams } from "@kwetter/models";
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
}
