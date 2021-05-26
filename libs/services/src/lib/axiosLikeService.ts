import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";

@Injectable()
export class AxiosLikeService {
	private serviceUrl: string = "/like";

	public getLikesByKweet(id: string, token: string) {
		const url: string = `${this.serviceUrl}/kweet/${id}`;

		return AxiosRequestHandler.get(url, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}
}
