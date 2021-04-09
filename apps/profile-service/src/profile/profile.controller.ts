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

//services
import { ProfileService } from "./profile.service";

//dto
import { DecodedToken, CreateProfileRequest } from "@kwetter/models";

//exceptions
import {
	BadRequestException,
	UnauthorizedException,
	InternalServerException,
	NotFoundException
} from "@kwetter/models";
import Profile from "./profile.entity";

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
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id?: string
	) {
		let profile = undefined;

		if (!id || id === "")
			profile = await this.profileService.getProfile(decoded.id, true);
		else profile = await this.profileService.getProfile(id);

		if (!profile) throw new NotFoundException();
		return profile;
	}
}
