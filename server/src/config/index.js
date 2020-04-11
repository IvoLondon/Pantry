import { merge } from 'lodash'
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
    env,
    isLocal: env === 'development',
    port: 9002,
}

let envConfig = {}

switch (env) {
    case 'dev':
    case 'development':
        envConfig = require('./local').config;
        break;
    default:
        envConfig = require('./prod').config;
}

export default merge(baseConfig, envConfig);