import { Controller } from "@nestjs/common";
import {
	Ctx,
	MessagePattern,
	Payload,
	RedisContext
} from "@nestjs/microservices";

import { UserRegisteredEvent } from "../event/user-registered.event";
import { MailService } from "./mail.service";

@Controller("mail")
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@MessagePattern("USER_REGISTERED")
	async userRegistered(
		@Payload() message: UserRegisteredEvent,
		@Ctx() context: RedisContext
	) {
		console.log(message);
		console.log(context);
		const { username, email } = message;
		this.mailService.send(
			email,
			`Welcome ${username}!`,
			"user-registered.hbs",
			message
		);
	}
}
