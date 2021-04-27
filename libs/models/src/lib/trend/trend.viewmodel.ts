import { TrendType } from "./trend.type";

export class TrendVM {
	id: string;
	name: string;

	constructor(trend: TrendType) {
		this.id = trend.id;
		this.name = trend.name;
	}
}
