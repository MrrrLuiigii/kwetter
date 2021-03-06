import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

//trend
import Trend from "./trend.entity";
import { TrendController } from "./trend.controller";
import { TrendService } from "./trend.service";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

@Module({
	imports: [
		TypeOrmModule.forFeature([Trend]),
		ClientsModule.register([
			{
				name: "TREND_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: REDIS_HOST,
					auth_pass: REDIS_PASSWORD
				}
			}
		])
	],
	controllers: [TrendController],
	providers: [TrendService]
})
export class TrendModule {}
