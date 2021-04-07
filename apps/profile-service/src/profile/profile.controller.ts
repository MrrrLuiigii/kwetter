import { Body, Controller, Get, Headers, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//services
import { ProfileService } from "./profile.service";

//dto
import { DecodedToken, CreateProfileRequest } from "@kwetter/models";

//exceptions
import {
	BadRequestException,
	UnauthorizedException,
	InternalServerException
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

	@Get()
	getData() {
		return this.profileService.getData();
	}
}
