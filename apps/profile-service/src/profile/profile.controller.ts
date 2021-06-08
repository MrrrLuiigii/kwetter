import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Inject,
	Param,
	Post,
	Query
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
	ProfileType,
	ProfileSearchVM,
	ProfileMinVM,
	BadRequestException,
	UnauthorizedException,
	InternalServerException
} from "@kwetter/models";
import { TrendType } from "libs/models/src/lib/trend/trend.type";
import { isArray, isUUID } from "class-validator";

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
		const trends = await this.axiosTrendService.postAndGetTrendIds(
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

		let trends = [];
		if (profile.trends.length)
			trends = await this.axiosTrendService.getTrends(
				profile.trends,
				decoded.token
			);

		return new ProfileVM(profile as ProfileType, trends);
	}

	@Get("min/:id")
	async getMinimalProfile(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string
	) {
		const profile = await this.profileService.getProfile(id, false);
		if (!profile)
			throw new NotFoundException(`Profile with id ${id} does not exist...`);

		return new ProfileMinVM(profile as ProfileType);
	}

	@Get("allmin/:ids")
	async getMinimalProfiles(
		@Headers("decoded") decoded: DecodedToken,
		@Param("ids") ids: string
	) {
		let idsArray = [];
		try {
			idsArray = ids.split(",");
			if (!isArray(idsArray)) throw idsArray;
			idsArray.forEach((id) => {
				if (!isUUID(id)) throw idsArray;
			});
		} catch (err) {
			throw new BadRequestException("Ids must be an array of uuid values...");
		}

		return (await this.profileService.getProfilesByIds(idsArray)).map(
			(p) => new ProfileMinVM(p as ProfileType)
		);
	}

	@Get("username/:username")
	async getProfileByUsername(
		@Headers("decoded") decoded: DecodedToken,
		@Param("username") username: string
	) {
		const profile = await this.profileService.getProfileByUsername(username);
		if (!profile) throw new NotFoundException();
		let trends = [];
		if (profile.trends.length)
			trends = await this.axiosTrendService.getTrends(
				profile.trends,
				decoded.token
			);
		return new ProfileVM(profile as ProfileType, trends);
	}

	@Get()
	async getProfilesByUsername(
		@Headers("decoded") decoded: DecodedToken,
		@Query("username") username: string
	) {
		return (await this.profileService.getProfilesByUsername(username)).map(
			(p) => new ProfileSearchVM(p as ProfileType)
		);
	}

	@Delete(":id")
	async deleteProfile(
		@Headers("decoded") decoded: DecodedToken,
		@Param("id") id: string
	) {
		const profile = await this.profileService.getProfileById(id);
		if (!profile) {
			throw new BadRequestException(`Profile with id ${id} does not exist...`);
		}

		if (decoded.id !== profile.authId) {
			throw new UnauthorizedException(
				"You can only delete your own account..."
			);
		}

		await this.profileService
			.deleteProfile(profile.id)
			.then(() => {
				this.client
					.send<string, Profile>("PROFILE_DELETED", profile)
					.toPromise()
					.catch(() => {});
			})
			.catch(() => {
				throw new InternalServerException();
			});
		return new ProfileVM(profile as ProfileType);
	}
}
