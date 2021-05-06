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

	constructor(profile: ProfileType, trends?: TrendType[]) {
		this.id = profile.id;
		this.username = profile.username;
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
	}
}

export class ProfileSearchVM {
	id: string;
	username: string;
	name: string;
	following: boolean;

	constructor(profile: ProfileType) {
		this.id = profile.id;
		this.username = profile.username;
		this.name = profile.name;
		this.following = false; //TODO search in array of following
	}
}
