import { ProfileType } from "./profile.type";

export class ProfileVM {
	id: string;
	name: string;
	web: string;
	bio: string;
	followers: string[]; //TODO
	followed: string[]; //TODO
	likes: string[]; //TODO
	mentions: string[]; //TODO
	kweets: string[]; //TODO
	trends: string[];

	constructor(profile: ProfileType) {
		this.id = profile.id;
		this.name = profile.name;
		this.web = profile.web;
		this.bio = profile.bio;
		this.followers = profile.followers;
		this.followed = profile.followed;
		this.likes = profile.likes;
		this.mentions = profile.mentions;
		this.kweets = profile.kweets;
		this.trends = profile.trends;
	}
}
