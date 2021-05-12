import { MentionSource } from "./mention.enum";

export class MentionType {
	id: string;
	type: MentionSource;
	mention: string;
	profileId: string;
	sourceId: string;
}
