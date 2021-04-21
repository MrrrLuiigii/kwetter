import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Trend")
export default class Trend {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({ unique: true })
	name!: string;

	constructor(name?: string) {
		if (name) this.name = name;
	}
}
