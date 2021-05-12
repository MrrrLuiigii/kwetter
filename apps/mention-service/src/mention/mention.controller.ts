import { Controller, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { MentionService } from "./mention.service";

@Controller()
export class MentionController {
	constructor(
		private readonly mentionService: MentionService,
		@Inject("MENTION_SERVICE") private readonly client: ClientProxy
	) {}
}
