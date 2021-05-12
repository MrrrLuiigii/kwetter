import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { MentionSource, MentionType } from "@kwetter/models";

@Entity("Mention")
export default class Mention {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({ type: "enum", enum: MentionSource, default: MentionSource.Kweet })
	type!: MentionSource;

	@Column()
	profileId!: string;

	@Column()
	mention!: string;

	//MentionType.Kweet   ->    kweet.id
	//MentionType.Bio     ->    profile.id
	@Column()
	sourceId!: string;
}
