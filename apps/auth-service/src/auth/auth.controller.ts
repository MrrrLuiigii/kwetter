import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	Inject,
	Patch,
	Post
} from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";

//services
import { AuthService } from "./auth.service";

//dto
import {
	RegisterRequest,
	LoginRequest,
	TokenStatus,
	ProfileType
} from "@kwetter/models";

//exceptions
import { BadRequestException, UnauthorizedException } from "@kwetter/models";

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

		await this.authService.getAuth(username, email).catch((err) => {
			throw err;
		});

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
			});
	}

	@Post("login")
	@HttpCode(200)
	async login(@Body() { username, password }: LoginRequest) {
		return await this.authService.login(username, password);
	}

	@Patch("verify")
	async verify(@Headers() { authorization }) {
		return await this.authService.verify(authorization);
	}

	@Get("validate")
	async validate(@Headers() { authorization }) {
		if (!authorization)
			throw new BadRequestException("No authorization headers present...");

		const { status, decoded } = this.authService.validateJWT(authorization);

		switch (status) {
			case TokenStatus.Valid:
				return { status: true, decoded };
			case TokenStatus.Expired:
				throw new UnauthorizedException("Token expired...");
			case TokenStatus.Invalid:
				throw new UnauthorizedException("Invalid token...");
		}
	}

	@MessagePattern("PROFILE_DELETED")
	async profileDeleted(@Payload() message: ProfileType) {
		return await this.authService.deleteAccount(message.authId);
	}
}
