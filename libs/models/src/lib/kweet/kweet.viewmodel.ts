import { TrendType } from "../trend/trend.type";
import { TrendVM } from "../trend/trend.viewmodel";
import { KweetType } from "./kweet.type";

export class KweetProfileVM {
	id: string;
	username: string;

	constructor(id: string, username: string) {
		this.id = id;
		this.username = username;
	}
}

export class KweetVM {
	id: string;
	body: string;
	profile: KweetProfileVM;
	trends: TrendVM[];
	mentions: string[]; //TODO: MentionVM type
	likes: string[]; //TODO LikeVM type
	createdAt: Date;

	constructor(kweet: KweetType, username: string, trends?: TrendType[]) {
		this.id = kweet.id;
		this.body = kweet.body;
		this.profile = new KweetProfileVM(kweet.profileId, username);
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
