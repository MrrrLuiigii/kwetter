import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { TypeOrmModule } from "@nestjs/typeorm";

//controllers
import { ProfileController } from "./profile.controller";

//services
import { ProfileService } from "./profile.service";

//entities
import Profile from "./profile.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Profile]),
		ClientsModule.register([
			{
				name: "PROFILE_SERVICE",
				transport: Transport.REDIS,
				options: {
					url: "redis://localhost:6379",
					auth_pass: "redispassword"
				}
			}
		])
	],
	controllers: [ProfileController],
	providers: [ProfileService]
})
export class ProfileModule {}
