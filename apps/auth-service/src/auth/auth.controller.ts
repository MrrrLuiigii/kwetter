import { Body, Controller, Headers, Inject, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//services
import { AuthService } from "./auth.service";

//dto
import { RegisterRequest, LoginRequest } from "@kwetter/models";

//exceptions
import {
	BadRequestException,
	UnauthorizedException,
	InternalServerException
} from "@kwetter/models";

const typeOrmErr = {
	DUPE_ENTRY: "ER_DUP_ENTRY"
};

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		@Inject("AUTH_SERVICE") private readonly client: ClientProxy
	) {}

	@Post("register")
	async register(
		@Body() { username, email, password, passwordVerify }: RegisterRequest
	) {
		if (password !== passwordVerify)
			throw new BadRequestException("Passwords don't match...");

		return await this.authService
			.register(username, email, password)
			.then((auth) => {
				const authVM = this.authService.createJWT(auth);
				this.client
					.send<string, object>("USER_REGISTERED", {
						username,
						email,
						jwt: authVM.token
					})
					.toPromise();
				return authVM;
			})
			.catch((err) => {
				console.log(err);
				let message = err.message;
				if (err.code === typeOrmErr.DUPE_ENTRY)
					message = "This username is taken...";
				throw new BadRequestException(message);
			});
	}

	@Post("login")
	async login(@Body() { username, password }: LoginRequest) {
		return await this.authService
			.login(username, password)
			.then((authVM) => {
				return authVM;
			})
			.catch((err) => {
				throw err;
			});
	}

	@Patch("verify")
	async verify(@Headers() { authorization }) {
		return await this.authService.verify(authorization);
	}
}
