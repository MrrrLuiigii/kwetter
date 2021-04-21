//TODO: validate

import { IsAlphanumeric, IsArray, ValidateNested } from "class-validator";

export class AddTrendsRequest {
	@IsArray()
	@IsAlphanumeric("", { each: true })
	trends: string[];
}

export class GetTrendsRequest {
	@IsArray()
	trends: string[];
}
