import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Profile")
export default class Profile {
	@PrimaryGeneratedColumn("uuid")
	uuid!: string;

	@Column()
	name!: string;

	@Column()
	web!: string;

	@Column()
	bio!: string;

	@Column("simple-array")
	followers!: string[];

	@Column("simple-array")
	followed!: string[];

	@Column("simple-array")
	likes!: string[];

	@Column("simple-array")
	mentions!: string[];

	@Column("simple-array")
	kweets!: string[];

	@Column("simple-array")
	trends!: string[];
}
