import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";

@Injectable()
export class AxiosProfileService {
	private serviceUrl: string = "/profile";

	public getMinimalProfileById(id: string, token: string) {
		const url: string = `${this.serviceUrl}/min/${id}`;

		return AxiosRequestHandler.get(url, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}

	public getMinimalProfilesByIds(ids: string[], token: string) {
		const url: string = `${this.serviceUrl}/allmin/${ids.join(",")}`;

		return AxiosRequestHandler.get(url, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}
}
