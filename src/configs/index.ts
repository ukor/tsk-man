import { Algorithm } from 'jsonwebtoken';

require('dotenv').config();

import {
	AppConfig,
	EnvironmentKeys,
	Environments,
	environments,
} from './configs.type';

const secrets = process.env;

const NODE_ENV: Environments =
	environments[(secrets.environment as EnvironmentKeys) || 'dev'];

const PORT = parseInt(secrets.PORT, 10) || 3080;

export const isProduction = (environment: string): boolean =>
	['production', 'prd', 'prod'].includes(environment);

export const isDevelopment = (environment: string): boolean =>
	['dev', 'development'].includes(environment);

console.log({
	doppler_env: secrets.DOPPLER_ENVIRONMENT,
	app_env: NODE_ENV,
	NODE_ENV,
});

export const configurations = (): AppConfig => ({
	appEnv: NODE_ENV,
	domain: '',
	appName: '',
	port: PORT,

	grafana: {
		lokiUser: secrets.GRAFANA_LOKI_USER,
		lokiPassword: secrets.GRAFANA_LOKI_KEY,
	},
	mongo: {
		host: secrets.MONGO_HOST,
		// user: `${NODE_ENV}${secrets.MONGO_USER}`,
		user: `${secrets.MONGO_USER}`,
		password: secrets.MONGO_PASSWORD,
		name: `${NODE_ENV}_${secrets.MONGO_NAME}` || `tsk_man_${NODE_ENV}`,
	},
	jwt: {
		secret: `${secrets.JWT_SECRET}_${NODE_ENV}`,
		algorithm: secrets.JWT_ALGORITHM as Algorithm,
	},
});
