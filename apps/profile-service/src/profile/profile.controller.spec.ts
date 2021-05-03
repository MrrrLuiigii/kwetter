import {
	CreateProfileRequest,
	DecodedToken,
	NotFoundException,
	ProfileType,
	ProfileVM
} from "@kwetter/models";
import { AxiosKweetService, AxiosTrendService } from "@kwetter/services";
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
	decoded.username = "";
	const mockCreateProfile = new CreateProfileRequest();
	const mockProfile = new Profile();
	const mockProfileVM = new ProfileVM(mockProfile as ProfileType, "");

	let mockProfileService = {
		createProfile: async () => mockProfile,
		getProfile: async (id: string) =>
			id === "existingId" ? mockProfile : undefined
	};

	let mockAxiosTrendService = {
		getTrends: () => [],
		getTrendIds: () => []
	};
	let mockAxiosKweetService = {
		getByProfileId: () => undefined
	};

	let profileController: ProfileController;
	let profileService: ProfileService;
	let axiosTrendService: AxiosTrendService;
	let axiosKweetService: AxiosKweetService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [ProfileController],
			providers: [ProfileService, AxiosTrendService, AxiosKweetService],
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
			.overrideProvider(AxiosTrendService)
			.useValue(mockAxiosTrendService)
			.overrideProvider(AxiosKweetService)
			.useValue(mockAxiosKweetService)
			.compile();

		axiosTrendService = moduleRef.get<AxiosTrendService>(AxiosTrendService);
		axiosKweetService = moduleRef.get<AxiosKweetService>(AxiosKweetService);
		profileService = moduleRef.get<ProfileService>(ProfileService);
		profileController = moduleRef.get<ProfileController>(ProfileController);
	});

	describe("[POST] createProfile", () => {
		it("returns profile", async () => {
			expect(
				await profileController.createProfile(decoded, mockCreateProfile)
			).toEqual(mockProfileVM);
		});
	});

	describe("[GET] getProfile", () => {
		it("returns profile when existing id is passed", async () => {
			expect(await profileController.getProfile(decoded, "existingId")).toEqual(
				mockProfileVM
			);
		});

		it("returns notFoundException when non-existing id is passed", async () => {
			await expect(
				profileController.getProfile(decoded, "nonExistingId")
			).rejects.toEqual(new NotFoundException());
		});
	});
});
