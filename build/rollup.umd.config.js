import replace from "@rollup/plugin-replace";
import basicConfig, {file} from "./rollup.config";

const config = {
  ...basicConfig,
  output: {
    name: 'HttpFetch',
    file: file("umd"),
    format: "umd",
    exports: "default"
  }
}
config.plugins.push(replace({
  preventAssignment: true,
  'process.env.NODE_ENV': '"production"'
}))
export default config
