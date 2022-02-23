export declare type HttpFetchDataRequestFn = <T>(url: string, data?: HttpFetchConfig['data'], config?: Omit<HttpFetchConfig, 'data'>) => Promise<T>;
export declare type HttpFetchParamsRequestFn = <T>(url: string, params?: HttpFetchConfig['params'], config?: Omit<HttpFetchConfig, 'params'>) => Promise<T>;
export interface HttpFetchRequestResolver<T = HttpFetchConfig, R = HttpFetchConfig> {
    (config: T): Promise<R> | R;
}
export interface HttpFetchRequestRejecter<T = any, R = any> {
    (reason: T): Promise<R> | R;
}
export interface HttpFetchResponseResolver<T = any, R = any> {
    (data: T, response: Response, config: HttpFetchConfig): Promise<R> | R;
}
export interface HttpFetchResponseRejecter<T = HttpFetchResponseError, R = any> {
    (reason: T): Promise<R> | R;
}
export declare type HttpFetchInterceptorRequestHandler = HttpFetchRequestResolver | HttpFetchRequestRejecter | undefined | null;
export declare type HttpFetchInterceptorResponseHandler = HttpFetchResponseResolver | HttpFetchResponseRejecter | undefined | null;
export interface HttpFetchInstance {
    <R>(url: string, config?: HttpFetchConfig): Promise<R>;
    <R>(config: HttpFetchConfig): Promise<R>;
    config: HttpFetchConfig;
    get: HttpFetchParamsRequestFn;
    delete: HttpFetchParamsRequestFn;
    options: HttpFetchParamsRequestFn;
    head: HttpFetchParamsRequestFn;
    post: HttpFetchDataRequestFn;
    put: HttpFetchDataRequestFn;
    patch: HttpFetchDataRequestFn;
    interceptors: {
        request: {
            use: <T1 = HttpFetchConfig, T2 = any>(onFulfilled?: HttpFetchRequestResolver<T1> | null, onRejected?: HttpFetchRequestRejecter<T2> | null) => number;
            handlers: HttpFetchInterceptorRequestHandler[];
        };
        response: {
            use: <T1 = any, T2 = HttpFetchResponseError>(onFulfilled?: HttpFetchResponseResolver<T1> | null, onRejected?: HttpFetchResponseRejecter<T2> | null) => number;
            handlers: HttpFetchInterceptorResponseHandler[];
        };
    };
}
export interface HttpFetch extends HttpFetchInstance {
    create(config?: HttpFetchConfig): HttpFetchInstance;
}
export declare type TransformMethod = 'arrayBuffer' | 'blob' | 'json' | 'text' | 'formData';
export declare type HttpFetchResponseType = TransformMethod | 'stream';
export interface Progress {
    total: number;
    loaded: number;
}
export declare type HttpFetchHttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
export interface HttpFetchConfig extends RequestInit {
    url?: string;
    base?: string;
    data?: BodyInit | Record<string, any> | Array<any> | number | boolean | null;
    params?: any;
    timeout?: number;
    method?: HttpFetchHttpMethod;
    controller?: AbortController;
    responseType?: HttpFetchResponseType;
    headers?: HeadersInit & {
        'Content-Type'?: ContentType.json | ContentType.formData | ContentType.urlencoded | ContentType.text;
    };
    onDownloadProgress?: (progress: Progress) => void;
}
export declare enum ContentType {
    json = "application/json",
    formData = "multipart/form-data",
    urlencoded = "application/x-www-from-urlencoded",
    text = "text/plain"
}
export interface HttpFetchResponseError extends Error {
    config: HttpFetchConfig;
    response?: Response;
    data?: any;
}
export interface ReturnInterceptorResponse {
    data: any;
    response: Response;
}
