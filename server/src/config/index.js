import { merge } from 'lodash'
import { config } from 'dotenv';
config();

const env = process.env.NODE_ENV || 'development'

const baseConfig = {
    env,
    isLocal: env === 'development',
    port: 9002,
    authSecret: process.env.AUTH_SECRET,
}

let envConfig = {}

switch (env) {
    case 'dev':
    case 'development':
        envConfig = require('./local').configs;
        break;
    default:
        envConfig = require('./prod').configs;
}

export default merge(baseConfig, envConfig);