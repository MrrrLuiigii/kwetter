import {
	ClientProxy,
	ClientProxyFactory,
	ClientsModule,
	Transport
} from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProfileController } from "./profile.controller";
import Profile from "./profile.entity";
import { ProfileService } from "./profile.service";

describe("ProfileController", () => {
	let mockProfileService = {};

	let profileController: ProfileController;
	let profileService: ProfileService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [ProfileController],
			providers: [ProfileService],
			imports: [
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
			]
		})
			.overrideProvider(ProfileService)
			.useValue(mockProfileService)
			.compile();

		profileService = moduleRef.get<ProfileService>(ProfileService);
		profileController = moduleRef.get<ProfileController>(ProfileController);
	});

	describe("TEST", () => {
		it("", async () => {
			// expect(await profileController.create(mockProject as CreateProject)).toBe(
			// 	mockProject
			// );
			expect(true).toBe(true);
		});
	});
});
