import {
	Body,
	Controller,
	Get,
	Headers,
	Inject,
	Param,
	Post,
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
	ProfileType
} from "@kwetter/models";
import { TrendType } from "libs/models/src/lib/trend/trend.type";

@Controller("profile")
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly axiosTrendService: AxiosTrendService,
		private readonly axiosKweetService: AxiosKweetService,
		@Inject("PROFILE_SERVICE") private readonly client: ClientProxy
	) {}

	@Post()
	async createProfile(
		@Headers("decoded") decoded: DecodedToken,
		@Body() createProfileRequest: CreateProfileRequest
	) {
		const profile: Profile = { ...createProfileRequest, authId: decoded.id };
		const trends = await this.axiosTrendService.getTrendIds(
			profile.trends,
			decoded.token
		);
		profile.trends = trends.map((trend: TrendType) => trend.id);
		return new ProfileVM(
			(await this.profileService.createProfile(profile)) as ProfileType,
			decoded.username,
			trends
		);
	}

	@Get(":id?")
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

		const kweets = await this.axiosKweetService.getByProfileId(
			profile.id,
			decoded.token
		);

		return new ProfileVM(
			profile as ProfileType,
			decoded.username,
			trends,
			kweets
		);
	}
}
