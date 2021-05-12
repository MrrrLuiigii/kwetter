import {
	IsArray,
	IsEnum,
	IsString,
	IsUUID,
	ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { MentionSource } from "./mention.enum";

export class AddMentionsRequest {
	@IsArray()
	@ValidateNested()
	@Type(() => AddMention)
	mentions: AddMention[];
}

class AddMention {
	@IsEnum(MentionSource)
	type: MentionSource;

	@IsString()
	mention: string;

	@IsUUID()
	profileId: string;

	@IsUUID()
	sourceId: string;
}
