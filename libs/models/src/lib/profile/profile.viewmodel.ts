import { TrendType } from "../trend/trend.type";
import { TrendVM } from "../trend/trend.viewmodel";
import { ProfileType } from "./profile.type";

export class ProfileVM {
	id: string;
	username: string;
	name: string;
	web: string;
	bio: string;
	mentions: string[];
	trends: TrendVM[];

	constructor(profile: ProfileType, trends?: TrendType[]) {
		this.id = profile.id;
		this.username = profile.username;
		this.name = profile.name;
		this.web = profile.web;
		this.bio = profile.bio;
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
	}
}

export class ProfileMinVM {
	id: string;
	username: string;
	name: string;
	web: string;
	bio: string;

	constructor(profile: ProfileType) {
		this.id = profile.id;
		this.username = profile.username;
		this.name = profile.name;
		this.web = profile.web;
		this.bio = profile.bio;
	}
}
