import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//entities
import Profile from "./profile.entity";

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Profile)
		private profileRepository: Repository<Profile>
	) {}

	public async createProfile(profile: Profile): Promise<Profile> {
		const oldProfile: Profile = await this.profileRepository.findOne({
			where: { authId: profile.authId }
		});

		if (oldProfile) {
			profile = { ...profile, id: oldProfile.id, authId: oldProfile.authId };
		}

		return await this.profileRepository.save(profile);
	}

	getData(): { message: string } {
		return { message: "Welcome to profile-service!" };
	}
}
