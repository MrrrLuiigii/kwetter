import { LikeType } from "../like/like.type";
import { LikeVM } from "../like/like.viewmodel";
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
	likes: KweetLikesVM; //TODO LikeVM type
	createdAt: Date;

	constructor(
		kweet: KweetType,
		username: string,
		trends?: TrendType[],
		likes?: LikeType[]
	) {
		this.id = kweet.id;
		this.body = kweet.body;
		this.profile = new KweetProfileVM(kweet.profileId, username);
		this.trends = [];
		if (trends && trends.length)
			trends.forEach((trend) => {
				this.trends.push(new TrendVM(trend));
			});
		this.mentions = kweet.mentions;
		this.likes = new KweetLikesVM();
		if (likes && likes.length) {
			likes.forEach((like) => {
				this.likes.likes.push(new LikeVM(like));
			});
			this.likes.count = likes.length;
		}
		this.createdAt = kweet.createdAt;
	}
}

class KweetLikesVM {
	count: number;
	likes: LikeVM[];

	constructor() {
		this.count = 0;
		this.likes = [];
	}
}
