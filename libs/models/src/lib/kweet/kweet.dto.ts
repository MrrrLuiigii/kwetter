import { IsArray, IsString, IsUUID } from "class-validator";

export class PostKweetRequest {
	@IsString()
	body: string;

	@IsUUID()
	profileId: string;

	@IsArray()
	mentions: string[];

	@IsArray()
	trends: string[];
}
