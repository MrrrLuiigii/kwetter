import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Kweet")
export default class Kweet {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({ length: 140 })
	body!: string;

	@Column()
	profileId!: string;

	@Column()
	createdAt!: Date;

	@Column("simple-array", { nullable: true })
	mentions?: string[];

	@Column("simple-array", { nullable: true })
	trends?: string[];

	@Column("simple-array", { nullable: true })
	likes?: string[];
}
