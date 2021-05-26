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
}
