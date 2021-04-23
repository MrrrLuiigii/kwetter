import {
	Body,
	Controller,
	Get,
	Headers,
	Inject,
	Param,
	Post
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//profile
import Profile from "./profile.entity";
import { ProfileService } from "./profile.service";

//libs
import { AxiosTrendService } from "@kwetter/services";
import {
	DecodedToken,
	CreateProfileRequest,
	ProfileVM,
	NotFoundException,
	Profile as ProfileType
} from "@kwetter/models";

@Controller("profile")
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		@Inject("PROFILE_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async createProfile(
		@Headers("decoded") decoded: DecodedToken,
		@Body() createProfileRequest: CreateProfileRequest
	) {
		const profile: Profile = { ...createProfileRequest, authId: decoded.id };
		return await this.profileService.createProfile(profile);
	}

	@Get(":id?")
	async getProfile(
		@Headers("Authorization") token: string,
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id?: string
	) {
		let profile: Profile = undefined;

		if (!id || id === "")
			profile = await this.profileService.getProfile(decoded.id, true);
		else profile = await this.profileService.getProfile(id);

		if (!profile) throw new NotFoundException();

		profile.trends = await AxiosTrendService.getTrends(profile.trends, token);

		const profileVM: ProfileVM = new ProfileVM(profile as ProfileType);
		return profileVM;
	}
}
