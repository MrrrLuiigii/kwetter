import { AccountStatus, Role } from "./auth.enum";

export class AuthVM {
	id: number;
	username: string;
	email: string;
	role: Role;
	status: AccountStatus;
	token: string;
}
