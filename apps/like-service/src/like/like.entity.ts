import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Like")
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
