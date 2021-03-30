import { Injectable } from "@nestjs/common";

@Injectable()
export class ProfileService {
	getData(): { message: string } {
		return { message: "Welcome to profile-service!" };
	}
}
