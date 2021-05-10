import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Profile")
export default class Profile {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({ unique: true })
	authId!: string;

	@Column()
	username!: string;

	@Column()
	name!: string;

	@Column()
	web!: string;

	@Column()
	bio!: string;

	@Column("simple-array", { nullable: true })
	likes?: string[];

	@Column("simple-array", { nullable: true })
	mentions?: string[];

	@Column("simple-array", { nullable: true })
	trends?: string[];
}
