import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

//libs
import { UserRegisteredEvent } from "@kwetter/models";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	public send(
		to: string,
		subject: string,
		template: string,
		context: UserRegisteredEvent
	): void {
		this.mailerService
			.sendMail({
				to,
				from: "noreply@kwetter.com",
				subject,
				template,
				context
			})
			.then(() => {
				console.log(`Mail sent to: ${to}`);
			})
			.catch((error) => {
				console.log("Mail not sent...", error);
			});
	}
}
