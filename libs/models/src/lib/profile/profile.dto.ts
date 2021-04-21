import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";

//TODO: validate

export class CreateProfileRequest {
	name: string;
	web: string;
	bio: string;
	trends: string[];
}
