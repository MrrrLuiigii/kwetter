import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

//mail
import { MailService } from "./mail.service";

//libs
import { UserRegisteredEvent } from "@kwetter/models";

@Controller("mail")
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@MessagePattern("USER_REGISTERED")
	async userRegistered(
		@Payload() message: UserRegisteredEvent
		// @Ctx() context: RedisContext
	) {
		const { username, email } = message;
		this.mailService.send(
			email,
			`Welcome ${username}!`,
			"user-registered.hbs",
			message
		);
	}
}
