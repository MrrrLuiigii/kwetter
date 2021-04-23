import axios, { AxiosResponse, AxiosError } from "axios";
import { HttpException } from "@nestjs/common";

class AxiosRequestHandler {
	private static api = axios.create({
		baseURL: "http://localhost:3000",
		headers: {
			Authorization: ""
		}
	});

	private static setAuthHeaders(token: string) {
		const authHeaders = token;
		if (this.api) this.api.defaults.headers["Authorization"] = authHeaders;
		return authHeaders;
	}

	public static get(url: string, token: string): any {
		this.setAuthHeaders(token);
		return this.api
			.get(url)
			.then((res: AxiosResponse) => {
				if (!this.checkResponseOK(res))
					throw this.checkStatusCode(res.status, res.data);
				return res;
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					throw this.checkStatusCode(
						err.response.status,
						err.response.data.message
					);
				}
			});
	}

	public static post(url: string, object: any, token: string): any {
		this.setAuthHeaders(token);
		return this.api
			.post(url, object)
			.then((res: AxiosResponse) => {
				if (!this.checkResponseOK(res))
					throw this.checkStatusCode(res.status, res.data);
				return res;
			})
			.catch((err: AxiosError) => {
				throw this.checkStatusCode(
					err.response.status,
					err.response.data.message
				);
			});
	}

	public static put(url: string, object: any, token: string): any {
		this.setAuthHeaders(token);
		return this.api
			.put(url, object)
			.then((res: AxiosResponse) => {
				if (!this.checkResponseOK(res))
					throw this.checkStatusCode(res.status, res.data);
				return res;
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					throw this.checkStatusCode(
						err.response.status,
						err.response.data.message
					);
				}
			});
	}

	public static patch(url: string, object: any, token: string): any {
		this.setAuthHeaders(token);
		return this.api
			.patch(url, object)
			.then((res: AxiosResponse) => {
				if (!this.checkResponseOK(res))
					throw this.checkStatusCode(res.status, res.data);
				return res;
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					throw this.checkStatusCode(
						err.response.status,
						err.response.data.message
					);
				}
			});
	}

	public static delete(url: string, object: any, token: string): any {
		this.setAuthHeaders(token);
		return this.api
			.delete(url, {
				data: object
			})
			.then((res: AxiosResponse) => {
				if (!this.checkResponseOK(res))
					throw this.checkStatusCode(res.status, res.data);
				return res;
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					throw this.checkStatusCode(
						err.response.status,
						err.response.data.message
					);
				}
			});
	}

	private static checkResponseOK(res: AxiosResponse): boolean {
		return res.status >= 200 && res.status < 300;
	}

	private static checkStatusCode(
		status: number,
		message: string
	): HttpException {
		return new HttpException(message, status);
	}
}

export default AxiosRequestHandler;
