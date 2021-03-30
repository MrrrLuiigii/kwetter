import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";

export class RegisterRequest {
	@IsAlphanumeric()
	@Length(3, 15)
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	@Length(10)
	password: string;

	@IsString()
	@Length(10)
	passwordVerify: string;
}

export class LoginRequest {
	username: string;
	password: string;
}
