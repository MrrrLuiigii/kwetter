import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//kweet
import Kweet from "./kweet.entity";
import { KweetController } from "./kweet.controller";
import { KweetService } from "./kweet.service";

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
		TypeOrmModule.forFeature([Kweet]),
		ClientsModule.register([
			{
				name: "KWEET_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: REDIS_HOST,
					auth_pass: REDIS_PASSWORD
				}
			}
		])
	],
	controllers: [KweetController],
	providers: [KweetService, AxiosTrendService]
})
export class KweetModule {}
