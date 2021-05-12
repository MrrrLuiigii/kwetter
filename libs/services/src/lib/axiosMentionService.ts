import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import AxiosRequestHandler from "./axiosRequestHandler";

@Injectable()
export class AxiosMentionService {
	private serviceUrl: string = "/mention";

	public postAndGetMentionIds(mentions: string[], token: string) {
		// const addMentionsRequest: AddMentionsRequest = {
		// 	mentions
		// };
		// return AxiosRequestHandler.post(this.serviceUrl, addMentionsRequest, token)
		// 	.then((res: AxiosResponse) => {
		// 		return res.data;
		// 	})
		// 	.catch((err: any) => {
		// 		throw err;
		// 	});
	}
}
