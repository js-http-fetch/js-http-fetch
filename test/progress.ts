import {HttpFetchInstance} from "../src/types";
import Fetch from "../src/index";

// downLoadProgress(Fetch)
function downLoadProgress(Fetch: HttpFetchInstance) {
  Fetch.post('http://localhost:3000', null, {
    onDownloadProgress(progress) {
      console.log(progress)
    }
  })
}
