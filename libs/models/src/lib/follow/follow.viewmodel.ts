import { ProfileMinVM } from "../profile/profile.viewmodel";

export class FollowVM {
	followers: ProfileMinVM[];
	following: ProfileMinVM[];

	constructor(followers: ProfileMinVM[], following: ProfileMinVM[]) {
		this.followers = followers;
		this.following = following;
	}
}
