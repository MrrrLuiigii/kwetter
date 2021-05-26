import { IsUUID } from "class-validator";

export class LikeKweetRequest {
	@IsUUID()
	kweetId: string;

	@IsUUID()
	profileId: string;
}
