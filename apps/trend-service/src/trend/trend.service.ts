import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Trend from "./trend.entity";

@Injectable()
export class TrendService {
	constructor(
		@InjectRepository(Trend)
		private trendRepository: Repository<Trend>
	) {}

	async addTrends(trends: string[]): Promise<Trend[]> {
		const trendObjects: Trend[] = [];
		trends.forEach((trend: string) => {
			trendObjects.push(new Trend(trend));
		});

		await this.trendRepository
			.createQueryBuilder()
			.insert()
			.into(Trend)
			.values(trendObjects)
			.orIgnore()
			.execute();

		return await this.getTrendsByName(trends);
	}

	async getTrendsByIds(ids: string[]): Promise<string[]> {
		const trendObjects: Trend[] = [];
		ids.forEach((id: string) => {
			const trend = new Trend();
			trend.id = id;
			trendObjects.push(trend);
		});

		return (await this.trendRepository.find({ where: trendObjects })).map(
			(t) => t["name"]
		);
	}

	private async getTrendsByName(names: string[]): Promise<Trend[]> {
		const trendObjects: Trend[] = [];
		names.forEach((name: string) => {
			trendObjects.push(new Trend(name));
		});
		console.log(trendObjects);
		return await this.trendRepository.find({ where: trendObjects });
	}
}
