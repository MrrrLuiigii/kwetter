import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";

export class AxiosTrendService {
	private static serviceUrl: string = "/trend";

	public static getTrends(ids: string[], token: string) {
		const url: string = `${this.serviceUrl}/${ids.join(",")}`;

		console.log(url);
		return AxiosRequestHandler.get(url, token)
			.then((res: AxiosResponse) => {
				return res.data;
			})
			.catch((err: any) => {
				throw err;
			});
	}
}
