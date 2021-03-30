import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//controllers
import { AuthController } from "./auth.controller";

//services
import { AuthService } from "./auth.service";

//entities
import Authentication from "./auth.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Authentication]),
		ClientsModule.register([
			{
				name: "AUTH_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: "redis://localhost:6379",
					auth_pass: "redispassword"
				}
			}
		])
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
