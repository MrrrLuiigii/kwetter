import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

//enums
import { AccountStatus, Role } from "@kwetter/models";

@Entity("Authentication")
export default class Authentication {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	username!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@Column({ type: "enum", enum: Role, default: Role.User })
	role!: Role;

	@Column({ type: "enum", enum: AccountStatus, default: AccountStatus.Pending })
	status!: AccountStatus;
}
