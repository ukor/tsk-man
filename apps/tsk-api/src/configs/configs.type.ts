import { Algorithm } from 'jsonwebtoken';

export const environments = {
	dev: 'development',
	stg: 'staging',
	prd: 'production',
} as const;

export type EnvironmentKeys = keyof typeof environments;
export type Environments = (typeof environments)[EnvironmentKeys];

export type MongoConfigs = {
	host: string;
	user: string;
	password: string;
	name: string;
};

export type JwtConfigs = {
	secret: string;
	algorithm: Algorithm;
};

export type GrafanaConfigs = {
	lokiUser: string;
	lokiPassword: string;
};

export type AppConfig = {
	appEnv: Environments;
	port: number;
	appName: string;
	domain: string;
	grafana: GrafanaConfigs;
	mongo: MongoConfigs;
	jwt: JwtConfigs;
};
