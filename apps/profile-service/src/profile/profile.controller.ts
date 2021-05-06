import {
	Body,
	Controller,
	Get,
	Headers,
	Inject,
	Param,
	Post,
	Query,
	Req
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//profile
import Profile from "./profile.entity";
import { ProfileService } from "./profile.service";

//libs
import { AxiosKweetService, AxiosTrendService } from "@kwetter/services";
import {
	DecodedToken,
	CreateProfileRequest,
	ProfileVM,
	NotFoundException,
	ProfileType,
	ProfileSearchVM
} from "@kwetter/models";
import { TrendType } from "libs/models/src/lib/trend/trend.type";

@Controller("profile")
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly axiosTrendService: AxiosTrendService,
		@Inject("PROFILE_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async createProfile(
		@Headers("decoded") decoded: DecodedToken,
		@Body() createProfileRequest: CreateProfileRequest
	) {
		const profile: Profile = {
			...createProfileRequest,
			authId: decoded.id,
			username: decoded.username
		};
		const trends = await this.axiosTrendService.getTrendIds(
			profile.trends,
			decoded.token
		);
		profile.trends = trends.map((trend: TrendType) => trend.id);
		return new ProfileVM(
			(await this.profileService.createProfile(profile)) as ProfileType,
			trends
		);
	}

	@Get("id/:id?")
	async getProfile(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id?: string
	) {
		let profile: Profile = undefined;

		if (!id || id === "")
			profile = await this.profileService.getProfile(decoded.id, true);
		else profile = await this.profileService.getProfile(id);

		if (!profile) throw new NotFoundException();

		const trends = await this.axiosTrendService.getTrends(
			profile.trends,
			decoded.token
		);

		return new ProfileVM(profile as ProfileType, trends);
	}

	@Get()
	async getProfiles(
		@Headers("decoded") decoded: DecodedToken,
		@Query("username") username: string
	) {
		return (await this.profileService.getprofiles(username)).map(
			(p) => new ProfileSearchVM(p as ProfileType)
		);
	}
}
