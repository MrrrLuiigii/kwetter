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

	public async getByProfileId(id: string) {
		return await this.kweetRepository.find({ where: { profileId: id } });
	}
}
