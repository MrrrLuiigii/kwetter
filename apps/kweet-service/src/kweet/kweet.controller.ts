import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Headers
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//kweet
import Kweet from "./kweet.entity";
import { KweetService } from "./kweet.service";

//libs
import { DecodedToken, PostKweetRequest } from "@kwetter/models";
import { AxiosTrendService } from "@kwetter/services";

@Controller("kweet")
export class KweetController {
	constructor(
		private readonly kweetService: KweetService,
		private readonly axiosTrendService: AxiosTrendService,
		@Inject("KWEET_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async postKweet(
		@Headers("decoded") decoded: DecodedToken,
		@Body() postKweetRequest: PostKweetRequest
	) {
		const kweet: Kweet = {
			...postKweetRequest,
			createdAt: new Date(new Date().getTime() + 0 * 60 * 60 * 1000)
		};

		kweet.trends = await this.axiosTrendService.getTrendIds(
			postKweetRequest.trends,
			decoded.token
		);

		return await this.kweetService.postKweet(kweet);
	}

	@Get("/:id")
	async getKweets(@Param("id") id: string) {
		return await this.kweetService.getByProfileId(id);
	}
}
