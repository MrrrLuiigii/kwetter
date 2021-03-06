import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

//modules
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.REDIS,
		options: {
			url: REDIS_HOST,
			auth_pass: REDIS_PASSWORD
		}
	});
	const port = new ConfigService().get<number>("PORT") || 3001;
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	await app.startAllMicroservicesAsync();
	await app.listen(port);
	console.log(`Auth-service is listening on: ${await app.getUrl()}`);
}
bootstrap();
