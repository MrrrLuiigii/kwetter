import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

//modules
import { MailModule } from "./mail/mail.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

//validation
import * as Joi from "joi";

@Module({
	imports: [
		MailModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid("development", "production")
					.default("development"),
				PORT_MAIL: Joi.number().required(),
				SMTP_CONNECTION: Joi.string().required(),
				REDIS_HOST: Joi.string().required(),
				REDIS_PASSWORD: Joi.string().required()
			})
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule.forRoot()],
			useFactory: (configService: ConfigService) => {
				return {
					transport: configService.get<string>("SMTP_CONNECTION"),
					defaults: {
						from: "Kwetter <noreply@kwetter.com>"
					},
					template: {
						dir: "apps/mail-service/src/templates",
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true
						}
					}
				};
			},
			inject: [ConfigService]
		})
	]
})
export class AppModule {}
