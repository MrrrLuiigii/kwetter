import { IsAlphanumeric, IsEmail, IsJWT, Length } from "class-validator";

export class UserRegisteredEvent {
	@IsAlphanumeric()
	@Length(3, 15)
	username: string;

	@IsEmail()
	email: string;

	@IsJWT()
	jwt: string;
}
