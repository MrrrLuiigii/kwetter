import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

//modules
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.REDIS,
		options: {
			url: "redis://localhost:6379",
			auth_pass: "redispassword"
		}
	});
	const port = new ConfigService().get<number>("PORT") || 3002;
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	await app.startAllMicroservicesAsync();
	await app.listen(port);
	console.log(`App is listening on: ${await app.getUrl()}`);
}
bootstrap();
