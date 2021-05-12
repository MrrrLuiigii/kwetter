import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { isEnum, isUUID } from "class-validator";

//mention
import { MentionService } from "./mention.service";

//libs
import { AddMentionsRequest, MentionSource } from "@kwetter/models";

@Controller("mention")
export class MentionController {
	constructor(
		private readonly mentionService: MentionService,
		@Inject("MENTION_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async addMentions(@Body() addMentionsRequest: AddMentionsRequest) {
		return await this.mentionService.addMentions(addMentionsRequest.mentions);
	}

	@Get(":id/:type?")
	async getMentionsBySource(
		@Param("id") sourceId: string,
		@Param("type") type?: MentionSource
	) {
		if (!isUUID(sourceId))
			throw new BadRequestException("SourceId must be a valid uuid...");
		if (type && !isEnum(type, MentionSource))
			throw new BadRequestException("Type must be a valid source...");
		return await this.mentionService.getMentionsBySource(sourceId, type);
	}
}
