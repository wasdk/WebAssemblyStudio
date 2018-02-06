export interface IConfig {
  serviceUrl: string;
  rustc: string;
}

const configUrl = "./config.json";
let config: IConfig;

export default async function getConfig() {
  if (!config) {
    config = await fetch(configUrl).then(resp => resp.json());
  }

  return config;
}
