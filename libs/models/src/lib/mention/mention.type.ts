import { MentionSource } from "./mention.enum";

export class MentionType {
	id: string;
	type: MentionSource;
	mention: string;
	name: string;
	sourceId: string;
}
