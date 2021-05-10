import { IsUUID } from "class-validator";

export class FollowRequest {
	@IsUUID()
	profileId: string;

	@IsUUID()
	followId: string;
}
