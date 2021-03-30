import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "MAIL_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: "redis://localhost:6379",
					auth_pass: "redispassword"
				}
			}
		])
	],
	controllers: [MailController],
	providers: [MailService]
})
export class MailModule {}
