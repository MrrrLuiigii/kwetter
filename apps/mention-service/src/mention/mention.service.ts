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
}
