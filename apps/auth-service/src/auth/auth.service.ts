import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

//entities
import Authentication from "./auth.entity";

//exceptions
import { UnauthorizedException } from "@kwetter/models";

//enums
import { AccountStatus, Role } from "@kwetter/models";

//viewmodels
import { AuthVM } from "@kwetter/models";

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

	public createJWT(auth: Authentication): AuthVM {
		const token: string = jwt.sign(
			{ username: auth.username, email: auth.email, role: auth.role },
			this.jwtSecret,
			{ expiresIn: "1h" }
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

	public validateJWT(token: string): boolean {
		token = token.substring(token.indexOf(" ") + 1);

		try {
			jwt.verify(token, this.jwtSecret);
			return true;
		} catch (err) {
			throw new Error(err.name);
		}
	}
}
