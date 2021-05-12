import { MentionSource } from "@kwetter/models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Mention from "./mention.entity";

@Injectable()
export class MentionService {
	constructor(
		@InjectRepository(Mention)
		private mentionRepository: Repository<Mention>
	) {}

	async addMentions(mentions: Mention[]) {
		await this.mentionRepository
			.createQueryBuilder()
			.insert()
			.into(Mention)
			.values(mentions)
			.execute();
		return this.getMentionsBySource(mentions[0].sourceId, mentions[0].type);
	}

	public async getMentionsBySource(sourceId: string, type?: MentionSource) {
		if (type) return this.mentionRepository.find({ where: { sourceId, type } });
		return this.mentionRepository.find({ where: { sourceId } });
	}
}
