import { HttpFetchConfig, HttpFetchResponseError } from "./types";
export declare function makeError(reject: (reason?: any) => void, error: HttpFetchResponseError, config: HttpFetchConfig, response?: Response): void;
