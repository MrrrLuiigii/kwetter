import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { authenticate } from "@kwetter/auth";

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
	const port = new ConfigService().get<number>("PORT") || 3004;
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	await app.startAllMicroservicesAsync();
	app.use(authenticate);
	await app.listen(port);
	console.log(`Trend-service is listening on: ${await app.getUrl()}`);
}
bootstrap();
