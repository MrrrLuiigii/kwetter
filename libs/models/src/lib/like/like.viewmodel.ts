import { LikeType } from "./like.type";

export class LikeVM {
	profileId: string;
	createdAt: Date;

	constructor(like: LikeType) {
		this.profileId = like.profileId;
		this.createdAt = like.createdAt;
	}
}
