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

	public async getProfile(id: string, withAuth: boolean = false) {
		if (withAuth)
			return await this.profileRepository.findOne({ where: { authId: id } });
		return await this.profileRepository.findOne(id);
	}

	public async getProfilesByUsername(username: string) {
		return await this.profileRepository
			.createQueryBuilder("profile")
			.where("profile.username like :username", { username: `%${username}%` })
			.orWhere("profile.name like :name", { name: `%${username}%` })
			.getMany();
	}

	public async getProfilesByIds(ids: string[]) {
		const profileObjects: Profile[] = [];
		ids.forEach((id: string) => {
			const profile = new Profile();
			profile.id = id;
			profileObjects.push(profile);
		});

		return await this.profileRepository.find({ where: profileObjects });
	}
}
