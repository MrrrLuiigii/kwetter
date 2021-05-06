import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//profile
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import Profile from "./profile.entity";

//libs
import { AxiosTrendService } from "@kwetter/services";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

@Module({
	imports: [
		TypeOrmModule.forFeature([Profile]),
		ClientsModule.register([
			{
				name: "PROFILE_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: REDIS_HOST,
					auth_pass: REDIS_PASSWORD
				}
			}
		])
	],
	controllers: [ProfileController],
	providers: [ProfileService, AxiosTrendService]
})
export class ProfileModule {}
