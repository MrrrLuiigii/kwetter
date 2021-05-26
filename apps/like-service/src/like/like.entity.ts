import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("Like")
@Unique(["kweetId", "profileId"])
export default class Kweet {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	kweetId!: string;

	@Column()
	profileId!: string;

	@Column()
	createdAt!: Date;
}
