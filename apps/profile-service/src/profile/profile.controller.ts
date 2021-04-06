import { Body, Controller, Get, Headers, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//services
import { ProfileService } from "./profile.service";

//dto
import { CreateProfileRequest } from "@kwetter/models";

//exceptions
import {
	BadRequestException,
	UnauthorizedException,
	InternalServerException
} from "@kwetter/models";

@Controller("profile")
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		@Inject("PROFILE_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async createProfile(
		@Headers() decoded: string,
		@Body() createProfileRequest: CreateProfileRequest
	) {
		console.log(decoded);
		return await this.profileService.createProfile(createProfileRequest);
	}

	@Get()
	getData() {
		return this.profileService.getData();
	}
}
