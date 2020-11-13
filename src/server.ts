import ConfigKoa from './app'
import {config_server} from './config/config'
const app =new ConfigKoa(config_server.port)

  