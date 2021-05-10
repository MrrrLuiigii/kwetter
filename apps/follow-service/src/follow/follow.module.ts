import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//follow
import Follow from "./follow.entity";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";

//libs
import { AxiosProfileService } from "@kwetter/services";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

@Module({
	imports: [
		TypeOrmModule.forFeature([Follow]),
		ClientsModule.register([
			{
				name: "FOLLOW_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: REDIS_HOST,
					auth_pass: REDIS_PASSWORD
				}
			}
		])
	],
	controllers: [FollowController],
	providers: [FollowService, AxiosProfileService]
})
export class FollowModule {}
