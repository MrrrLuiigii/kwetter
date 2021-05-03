import { KweetType } from "../kweet/kweet.type";
import { KweetVM } from "../kweet/kweet.viewmodel";
import { TrendType } from "../trend/trend.type";
import { TrendVM } from "../trend/trend.viewmodel";
import { ProfileType } from "./profile.type";

export class ProfileVM {
	id: string;
	username: string;
	name: string;
	web: string;
	bio: string;
	followers: string[]; //TODO
	followed: string[]; //TODO
	likes: string[]; //TODO
	mentions: string[]; //TODO
	trends: TrendVM[];
	kweets: KweetVM[];

	constructor(
		profile: ProfileType,
		username: string,
		trends?: TrendType[],
		kweets?: KweetType[]
	) {
		this.id = profile.id;
		this.username = username;
		this.name = profile.name;
		this.web = profile.web;
		this.bio = profile.bio;
		this.followers = profile.followers;
		this.followed = profile.followed;
		this.likes = profile.likes;
		this.mentions = profile.mentions;

		this.trends = [];
		if (trends && trends.length)
			trends.forEach((trend) => {
				this.trends.push(new TrendVM(trend));
			});

		this.kweets = [];
		if (kweets && kweets.length)
			kweets.forEach((kweet) => {
				const trends = [];
				kweet.trends.forEach((t) => {
					trends.push(new TrendVM((t as unknown) as TrendType));
				});
				this.kweets.push(new KweetVM(kweet, username, trends));
			});
	}
}
