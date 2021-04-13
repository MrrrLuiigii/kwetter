import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "MAIL_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: REDIS_HOST,
					auth_pass: REDIS_PASSWORD
				}
			}
		])
	],
	controllers: [MailController],
	providers: [MailService]
})
export class MailModule {}
