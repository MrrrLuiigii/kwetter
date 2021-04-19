import {
	BadRequestException,
	LoginRequest,
	RegisterRequest,
	TokenStatus
} from "@kwetter/models";
import { UnauthorizedException } from "@nestjs/common";

import { ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import Authentication from "./auth.entity";
import { AuthService } from "./auth.service";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

describe("AuthController", () => {
	const mockAuth = new Authentication();
	const registerRequest = new RegisterRequest();
	const loginRequest = new LoginRequest();

	let mockAuthService = {
		register: async () => mockAuth,
		getAuth: async (username: string, email: string) => {
			if (username === "taken")
				throw new BadRequestException("Username is taken...");
			if (email === "taken@mail.nl")
				throw new BadRequestException("Email is taken...");
		},
		createJWT: () => mockAuth,
		login: (username: string, password: string) => {
			if (username === "nonExistent")
				throw new UnauthorizedException("Invalid credentials...");
			if (password === "invalid")
				throw new UnauthorizedException("Invalid credentials...");
			return mockAuth;
		},
		verify: (token: string) => {
			if (token === "invalidToken")
				throw new UnauthorizedException("Invalid token...");
			return mockAuth;
		},
		validateJWT: (token: string) => {
			if (token === "expired")
				return { status: TokenStatus.Expired, decoded: {} };
			if (token === "invalid")
				return { status: TokenStatus.Invalid, decoded: {} };
			return { status: TokenStatus.Valid, decoded: {} };
		}
	};

	let authController: AuthController;
	let authService: AuthService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService],
			imports: [
				ClientsModule.register([
					{
						name: "AUTH_SERVICE",
						transport: Transport.REDIS,
						options: {
							url: REDIS_HOST,
							auth_pass: REDIS_PASSWORD
						}
					}
				])
			]
		})
			.overrideProvider(AuthService)
			.useValue(mockAuthService)
			.compile();

		authService = moduleRef.get<AuthService>(AuthService);
		authController = moduleRef.get<AuthController>(AuthController);
	});

	describe("[POST] register", () => {
		it("returns auth", async () => {
			expect(await authController.register(registerRequest)).toBe(mockAuth);
		});

		it("returns badRequestException when passwords don't match", async () => {
			const registerRequest = new RegisterRequest();
			registerRequest.password = "password";
			registerRequest.passwordVerify = "p455w0rd";
			await expect(authController.register(registerRequest)).rejects.toEqual(
				new BadRequestException("Passwords don't match...")
			);
		});

		it("returns badRequestException when username is taken", async () => {
			const registerRequest = new RegisterRequest();
			registerRequest.username = "taken";
			await expect(authController.register(registerRequest)).rejects.toEqual(
				new BadRequestException("Username is taken...")
			);
		});

		it("returns badRequestException when email is taken", async () => {
			const registerRequest = new RegisterRequest();
			registerRequest.email = "taken@mail.nl";
			await expect(authController.register(registerRequest)).rejects.toEqual(
				new BadRequestException("Email is taken...")
			);
		});

		it("returns badRequestException when usename and email are taken", async () => {
			const registerRequest = new RegisterRequest();
			registerRequest.username = "taken";
			registerRequest.email = "taken@mail.nl";
			await expect(authController.register(registerRequest)).rejects.toEqual(
				new BadRequestException("Username is taken...")
			);
		});
	});

	describe("[POST] login", () => {
		it("returns auth", async () => {
			expect(await authController.login(loginRequest)).toBe(mockAuth);
		});

		it("returns unauthorizedException when username is not found", async () => {
			const loginRequest = new LoginRequest();
			loginRequest.username = "nonExistent";
			await expect(authController.login(loginRequest)).rejects.toEqual(
				new BadRequestException("Invalid credentials...")
			);
		});
		it("returns unauthorizedException when password is incorrect", async () => {
			const loginRequest = new LoginRequest();
			loginRequest.password = "invalid";
			await expect(authController.login(loginRequest)).rejects.toEqual(
				new BadRequestException("Invalid credentials...")
			);
		});
	});

	describe("[PATCH] verify", () => {
		it("returns auth", async () => {
			expect(await authController.verify({ authorization: "token" })).toBe(
				mockAuth
			);
		});

		it("returns unauthorizedException token is invalid", async () => {
			await expect(
				authController.verify({ authorization: "invalidToken" })
			).rejects.toEqual(new BadRequestException("Invalid token..."));
		});
	});

	describe("[GET] validate", () => {
		it("returns auth", async () => {
			expect(await authController.validate({ authorization: "token" })).toEqual(
				{
					status: true,
					decoded: {}
				}
			);
		});

		it("returns badRequestException when token is undefined", async () => {
			await expect(
				authController.validate({ authorization: undefined })
			).rejects.toEqual(
				new BadRequestException("No authorization headers present...")
			);
		});

		it("returns unauthorizedException when token is expired", async () => {
			await expect(
				authController.validate({ authorization: "expired" })
			).rejects.toEqual(new UnauthorizedException("Token expired..."));
		});

		it("returns unauthorizedException when token is invalid", async () => {
			await expect(
				authController.validate({ authorization: "invalid" })
			).rejects.toEqual(new UnauthorizedException("Invalid token..."));
		});
	});
});
