import { HttpFetchConfig, HttpFetchInterceptorRequestHandler, HttpFetchInterceptorResponseHandler, ReturnInterceptorResponse } from "./types";
export default function interceptor<T>(reqInterceptors: HttpFetchInterceptorRequestHandler[], request: (init: HttpFetchConfig) => Promise<ReturnInterceptorResponse>, resInterceptors: HttpFetchInterceptorResponseHandler[], config: HttpFetchConfig): Promise<T>;
