import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Headers,
	HttpCode
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//kweet
import Kweet from "./kweet.entity";
import { KweetService } from "./kweet.service";

//libs
import {
	DecodedToken,
	PostKweetRequest,
	KweetVM,
	KweetType
} from "@kwetter/models";
import { AxiosTrendService } from "@kwetter/services";
import { TrendType } from "libs/models/src/lib/trend/trend.type";

@Controller("kweet")
export class KweetController {
	constructor(
		private readonly kweetService: KweetService,
		private readonly axiosTrendService: AxiosTrendService,
		@Inject("KWEET_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	@HttpCode(200)
	async postKweet(
		@Headers("decoded") decoded: DecodedToken,
		@Body() postKweetRequest: PostKweetRequest
	) {
		let kweet: Kweet = {
			...postKweetRequest,
			createdAt: new Date(new Date().getTime() + 0 * 60 * 60 * 1000)
		};

		const trends = await this.axiosTrendService.getTrendIds(
			postKweetRequest.trends,
			decoded.token
		);
		kweet.trends = trends.map((trend: TrendType) => trend.id);
		return new KweetVM(
			(await this.kweetService.postKweet(kweet)) as KweetType,
			decoded.username,
			trends
		);
	}

	@Get("/:id")
	async getKweets(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string
	) {
		const kweets = await this.kweetService.getByProfileId(id);

		const kweetVMs: KweetVM[] = [];
		for (let i = 0; i < kweets.length; i++) {
			const trends = await this.axiosTrendService.getTrends(
				kweets[i].trends,
				decoded.token
			);
			kweetVMs.push(
				new KweetVM(kweets[i] as KweetType, decoded.username, trends)
			);
		}

		return kweetVMs;
	}
}
