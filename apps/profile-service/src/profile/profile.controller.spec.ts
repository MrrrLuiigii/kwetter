import {
	CreateProfileRequest,
	DecodedToken,
	NotFoundException
} from "@kwetter/models";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import { ProfileController } from "./profile.controller";
import Profile from "./profile.entity";
import { ProfileService } from "./profile.service";

const REDIS_HOST = process.env.REDIS_HOST
	? process.env.REDIS_HOST
	: "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
	? process.env.REDIS_PASSWORD
	: "";

describe("ProfileController", () => {
	const decoded = new DecodedToken();
	const mockCreateProfile = new CreateProfileRequest();
	const mockProfile = new Profile();

	let mockProfileService = {
		createProfile: async () => mockProfile,
		getProfile: async (id: string) =>
			id === "existingId" ? mockProfile : undefined
	};

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
							url: REDIS_HOST,
							auth_pass: REDIS_PASSWORD
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

	describe("[POST] createProfile", () => {
		it("returns project", async () => {
			expect(
				await profileController.createProfile(decoded, mockCreateProfile)
			).toBe(mockProfile);
		});
	});

	describe("[GET] getProfile", () => {
		it("returns project when existing id is passed", async () => {
			expect(await profileController.getProfile(decoded, "existingId")).toBe(
				mockProfile
			);
		});

		it("returns notFoundException when non-existing id is passed", async () => {
			await expect(
				profileController.getProfile(decoded, "nonExistingId")
			).rejects.toEqual(new NotFoundException());
		});
	});
});
