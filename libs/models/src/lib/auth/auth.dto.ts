import {
	IsAlphanumeric,
	IsEmail,
	IsEnum,
	IsJWT,
	IsString,
	Length
} from "class-validator";

import { Role } from "./auth.enum";

export class DecodedToken {
	@IsString()
	id: string;

	@IsAlphanumeric()
	@Length(3, 15)
	username: string;

	@IsEmail()
	email: string;

	@IsEnum(Role)
	role: Role;

	@IsJWT()
	token: string;
}

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
