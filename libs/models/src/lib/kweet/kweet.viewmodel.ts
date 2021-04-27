import { TrendType } from "../trend/trend.type";
import { TrendVM } from "../trend/trend.viewmodel";
import { KweetType } from "./kweet.type";

export class KweetVM {
	id: string;
	body: string;
	profileId: string;
	trends: TrendVM[];
	mentions: string[]; //TODO: MentionVM type
	likes: string[]; //TODO LikeVM type
	createdAt: Date;

	constructor(kweet: KweetType, trends?: TrendType[]) {
		this.id = kweet.id;
		this.body = kweet.body;
		this.profileId = kweet.profileId;

		this.trends = [];
		if (trends && trends.length)
			trends.forEach((trend) => {
				this.trends.push(new TrendVM(trend));
			});

		this.mentions = kweet.mentions;
		this.likes = kweet.likes;
		this.createdAt = kweet.createdAt;
	}
}
