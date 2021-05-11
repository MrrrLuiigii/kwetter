import { IsArray, IsString, IsUUID, Length } from "class-validator";

export class PostKweetRequest {
	@IsString()
	@Length(1, 140)
	body: string;

	@IsUUID()
	profileId: string;

	@IsArray()
	mentions: string[];

	@IsArray()
	trends: string[];
}
