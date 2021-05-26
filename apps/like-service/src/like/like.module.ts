import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//like
import Like from "./like.entity";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

@Module({
	imports: [
		TypeOrmModule.forFeature([Like]),
		ClientsModule.register([
			{
				name: "LIKE_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: REDIS_HOST,
					auth_pass: REDIS_PASSWORD
				}
			}
		])
	],
	controllers: [LikeController],
	providers: [LikeService]
})
export class LikeModule {}
