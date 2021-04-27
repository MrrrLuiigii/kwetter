import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

//authentication
import Authentication from "./auth.entity";

//libs
import {
	BadRequestException,
	UnauthorizedException,
	AccountStatus,
	Role,
	TokenStatus,
	AuthVM
} from "@kwetter/models";

@Injectable()
export class AuthService {
	private jwtSecret: string;

	constructor(
		@InjectRepository(Authentication)
		private authRepository: Repository<Authentication>,
		private configService: ConfigService
	) {
		this.jwtSecret = this.configService.get<string>("JWT_SECRET");
	}

	public async register(
		username: string,
		email: string,
		password: string
	): Promise<Authentication> {
		const saltRounds = 10;
		const hash = await bcrypt.hash(password, saltRounds);
		let authentication = {
			username,
			email,
			password: hash,
			role: Role.User,
			status: AccountStatus.Pending
		};
		return await this.authRepository.save(authentication);
	}

	public async login(username: string, password: string): Promise<AuthVM> {
		const auth = (await this.authRepository.findOne({
			where: { username }
		})) as Authentication;

		if (!auth) throw new UnauthorizedException("Invalid credentials...");

		if (!(await bcrypt.compare(password, auth.password)))
			throw new UnauthorizedException("Invalid credentials...");

		return this.createJWT(auth);
	}

	public async getAuth(username: string, email: string): Promise<void> {
		const auth = await this.authRepository.findOne({
			where: [{ username }, { email }]
		});

		if (auth && auth.username === username)
			throw new BadRequestException("Username is taken...");
		if (auth && auth.email === email)
			throw new BadRequestException("Email is taken...");
	}

	public async verify(token: string): Promise<AuthVM> {
		const tokenStatus = this.validateJWT(token);

		if (tokenStatus.status === TokenStatus.Valid) {
			const { username } = tokenStatus.decoded as AuthVM;
			const authentication = await this.authRepository.findOne({
				where: { username }
			});

			authentication.status = AccountStatus.Active;

			return this.createJWT(await this.authRepository.save(authentication));
		}

		throw new UnauthorizedException("Invalid token...");
	}

	public createJWT(auth: Authentication): AuthVM {
		const token: string = jwt.sign(
			{
				id: auth.id,
				username: auth.username,
				email: auth.email,
				role: auth.role
			},
			this.jwtSecret
			// { expiresIn: "1h" } //TODO: set back to one hour
		);
		const authVM: AuthVM = {
			id: auth.id,
			username: auth.username,
			email: auth.email,
			role: auth.role,
			status: auth.status,
			token
		};
		return authVM;
	}

	public validateJWT(token: string): { status: TokenStatus; decoded: Object } {
		token = token.substring(token.indexOf(" ") + 1);

		//TODO: throw different error types
		const tokenErr = {
			TOKEN_EXPIRED: "TokenExpiredError",
			TOKEN_ERR: "JsonWebTokenError",
			NOT_BEFORE: "NotBeforeError"
		};

		try {
			const decoded = jwt.verify(token, this.jwtSecret);
			decoded["token"] = token;
			return { status: TokenStatus.Valid, decoded };
		} catch (err) {
			return { status: TokenStatus.Invalid, decoded: {} };
		}
	}
}
