import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Headers,
	HttpCode,
	Query
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//like
import Like from "./like.entity";
import { LikeService } from "./like.service";

@Controller("like")
export class LikeController {
	constructor(
		private readonly likeService: LikeService,
		@Inject("LIKE_SERVICE") private readonly client: ClientProxy
	) {}
}
