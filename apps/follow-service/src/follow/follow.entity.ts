import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("Follow")
@Unique(["profileId", "followerId"])
export default class Follow {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	profileId: string;

	@Column()
	followerId: string;
}
