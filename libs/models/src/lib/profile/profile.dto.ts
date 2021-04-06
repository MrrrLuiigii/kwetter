import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";

export class CreateProfileRequest {
	name: string;
	web: string;
	bio: string;
	trends: string[];
}
