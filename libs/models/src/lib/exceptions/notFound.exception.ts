import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
	constructor(message: string = "Not found...") {
		super(message, HttpStatus.NOT_FOUND);
	}
}
