import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalServerException extends HttpException {
	constructor(message: string = "Something went wrong...") {
		super(message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
