import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { UserRegisteredEvent } from "../event/user-registered.event";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	public send(
		to: string,
		subject: string,
		template: string,
		context: UserRegisteredEvent
	): void {
		console.log(template);
		this.mailerService
			.sendMail({
				to,
				from: "noreply@kwetter.com",
				subject,
				template,
				context
			})
			.then(() => {
				console.log("mail sent");
			})
			.catch((error) => {
				console.log("mail not sent", error);
			});
	}
}
