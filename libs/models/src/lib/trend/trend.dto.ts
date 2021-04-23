import { IsArray } from "class-validator";

export class AddTrendsRequest {
	@IsArray()
	trends: string[];
}

export class GetTrendsRequest {
	@IsArray()
	trends: string[];
}
