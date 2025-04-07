import axios from "axios";

import {BASE_URL} from "./constants.ts";
import ApiService from "./ApiService";

enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

type RequesterConfig<Body> = {
    method: Method;
    url: string;
    data: Body;
    signal?: AbortSignal;
}

type Requester = <Response, Body>(config: RequesterConfig<Body>) => Promise<{ data: Response }>

class HttpService extends ApiService {
    private requester: Requester;

    constructor(baseURL: string) {
        super(baseURL);
        this.requester = axios.create({baseURL});
    }

    public get<Response>(url: string, config: Partial<RequesterConfig<undefined>> = {}): Promise<Response> {
        return this.request<Response>(Method.GET, url, {}, config);
    }

    public post<Response, Body>(url: string, data: Body, config: Partial<RequesterConfig<Body>> = {}): Promise<Response> {
        return this.request<Response, Body>(Method.POST, url, data, config);
    }

    public put<Response, Body>(url: string, data: Body, config: Partial<RequesterConfig<Body>> = {}): Promise<Response> {
        return this.request<Response, Body>(Method.PUT, url, data, config);
    }

    public delete<Response, Body>(url: string, data: Body, config: Partial<RequesterConfig<Body>> = {}): Promise<Response> {
        return this.request<Response, Body>(Method.DELETE, url, data, config);
    }

    private request<Response, Body = Record<string, never>>(
        method: Method,
        url: string,
        data = {} as Body,
        config: Partial<RequesterConfig<Body>> = {}
    ): Promise<Response> {
        const {signal} = config;

        return this.requester<Response, Body>({method, url, signal, data}).then(res => res.data);
    }
}

export default new HttpService(BASE_URL);
