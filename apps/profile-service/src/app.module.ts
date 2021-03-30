import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

//modules
import { ProfileModule } from "./profile/profile.module";

//validation
import * as Joi from "joi";

//entities
import Profile from "./profile/profile.entity";

const configservice = new ConfigService();

@Module({
	imports: [
		ProfileModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid("development", "production")
					.default("development"),
				PORT: Joi.number().default(3003),
				TYPEORM_CONNECTION: Joi.string()
					.valid(
						"mysql",
						"mariadb",
						"postgres",
						"cockroachdb",
						"sqlite",
						"mssql",
						"sap",
						"oracle",
						"cordova",
						"nativescript",
						"react-native",
						"sqljs",
						"mongodb",
						"aurora-data-api",
						"aurora-data-api-pg",
						"expo",
						"better-sqlite3"
					)
					.default("mysql"),
				TYPEORM_HOST: Joi.string().required(),
				TYPEORM_USERNAME: Joi.string().required(),
				TYPEORM_PASSWORD: Joi.string().required(),
				TYPEORM_DATABASE: Joi.string().required(),
				TYPEORM_PORT: Joi.number().default(3306),
				TYPEORM_SYNCHRONIZE: Joi.boolean().default(false),
				TYPEORM_LOGGING: Joi.boolean().default(false)
			})
		}),
		TypeOrmModule.forRoot({
			type: configservice.get<string>("TYPEORM_CONNECTION"),
			host: configservice.get<string>("TYPEORM_HOST"),
			port: configservice.get<number>("TYPEORM_PORT"),
			username: configservice.get<string>("TYPEORM_USERNAME"),
			password: configservice.get<string>("TYPEORM_PASSWORD"),
			database: configservice.get<string>("TYPEORM_DATABASE"),
			synchronize: configservice.get<boolean>("TYPEORM_SYNCHRONIZE"),
			logging: configservice.get<boolean>("TYPEORM_LOGGING"),
			entities: [Profile]
		} as TypeOrmModuleOptions)
	]
})
export class AppModule {}
