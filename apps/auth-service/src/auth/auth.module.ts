import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//controllers
import { AuthController } from "./auth.controller";

//services
import { AuthService } from "./auth.service";

//entities
import Authentication from "./auth.entity";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

@Module({
	imports: [
		TypeOrmModule.forFeature([Authentication]),
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
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
