import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { TrendService } from "./trend.service";

import { AddTrendsRequest, BadRequestException } from "@kwetter/models";
import { isArray, isUUID } from "class-validator";

@Controller("trend")
export class TrendController {
	constructor(
		private readonly trendService: TrendService,
		@Inject("TREND_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async addTrends(@Body() addTrendsRequest: AddTrendsRequest) {
		if (addTrendsRequest.trends.length === 0) return [];
		return await this.trendService.addTrends(addTrendsRequest.trends);
	}

	@Get(":ids")
	async getTrends(@Param("ids") ids: string) {
		let idsArray = [];
		try {
			idsArray = ids.split(",");
			if (!isArray(idsArray)) throw idsArray;
			idsArray.forEach((id) => {
				if (!isUUID(id)) throw idsArray;
			});
		} catch (err) {
			throw new BadRequestException("Ids must be an array of uuid values...");
		}

		if (idsArray.length === 0) return [];

		return await this.trendService.getTrendsByIds(idsArray);
	}
}
