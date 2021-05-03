import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";

@Injectable()
export class AxiosKweetService {
	private serviceUrl: string = "/kweet";

	public getByProfileId(id: string, token: string) {
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
