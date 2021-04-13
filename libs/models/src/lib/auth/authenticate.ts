import { Request, Response, NextFunction } from "express";
import axios from "axios";

//exceptions
import { BadRequestException } from "../exceptions/badRequest.exception";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";

//TODO: move to gateway

const AUTH_URL =
	(process.env.AUTH_SERVICE_HOST
		? process.env.AUTH_SERVICE_HOST
		: "http://localhost:3001") + "/auth/validate";

export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.path.startsWith("/auth")) return next();

	if (!req.headers["authorization"])
		return next(new BadRequestException("No authorization headers present..."));

	const { status, decoded } = await axios
		.get(AUTH_URL, {
			headers: { authorization: req.headers["authorization"] }
		})
		.then((response) =>
			response.status === 200
				? { status: response.data.status, decoded: response.data.decoded }
				: { status: false, decoded: undefined }
		)
		.catch(() => ({ status: false, decoded: undefined }));

	if (!status) return next(new UnauthorizedException("Invalid token..."));

	delete decoded.iat;
	delete decoded.exp;
	req.headers["decoded"] = decoded;
	return next();
}
