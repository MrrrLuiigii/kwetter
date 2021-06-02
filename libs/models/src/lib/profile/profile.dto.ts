import { IsArray, IsString, IsUrl, Length } from "class-validator";

export class CreateProfileRequest {
	@IsString()
	name: string;

	@IsUrl()
	web: string;

	@IsString()
	@Length(0, 140)
	bio: string;

	@IsArray()
	trends: string[];
}
