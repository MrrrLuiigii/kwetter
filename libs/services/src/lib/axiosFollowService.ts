import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";

@Injectable()
export class AxiosFollowService {
	private serviceUrl: string = "/follow";

	public getFollowsByProfileId(id: string, token: string) {
		const url: string = `${this.serviceUrl}/${id}`;
		return AxiosRequestHandler.get(url, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}
}
