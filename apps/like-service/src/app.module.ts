import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

//validation
import * as Joi from "joi";

//like
import Like from "./like/like.entity";
import { LikeModule } from "./like/like.module";

const configservice = new ConfigService();

@Module({
	imports: [
		LikeModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid("development", "production")
					.default("development"),
				PORT_LIKE: Joi.number().default(3007),
				REDIS_HOST: Joi.string().required(),
				REDIS_PASSWORD: Joi.string().required(),
				AUTH_SERVICE_HOST: Joi.string().required(),
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
				TYPEORM_DATABASE_LIKE: Joi.string().required(),
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
			database: configservice.get<string>("TYPEORM_DATABASE_LIKE"),
			synchronize: configservice.get<boolean>("TYPEORM_SYNCHRONIZE"),
			logging: configservice.get<boolean>("TYPEORM_LOGGING"),
			entities: [Like]
		} as TypeOrmModuleOptions)
	]
})
export class AppModule {}
