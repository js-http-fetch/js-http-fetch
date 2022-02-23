import {HttpFetchConfig, HttpFetchResponseError} from "./types";

export function makeError(reject: (reason?: any) => void, error: HttpFetchResponseError, config: HttpFetchConfig, response?: Response) {
  error.config = config
  error.response = response
  if (response) {
    response.text().then(data => {
      try {
        data = JSON.parse(data)
      } catch (e) {
      }
      error.data = data
      reject(error)
    })
  } else reject(error)
}
