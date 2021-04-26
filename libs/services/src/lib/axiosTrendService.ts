import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";
import { AddTrendsRequest } from "@kwetter/models";

@Injectable()
export class AxiosTrendService {
	private serviceUrl: string = "/trend";

	public getTrends(ids: string[], token: string) {
		const url: string = `${this.serviceUrl}/${ids.join(",")}`;

		return AxiosRequestHandler.get(url, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}

	public getTrendIds(trends: string[], token: string) {
		const addTrendsRequest: AddTrendsRequest = {
			trends
		};

		return AxiosRequestHandler.post(this.serviceUrl, addTrendsRequest, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}
}
