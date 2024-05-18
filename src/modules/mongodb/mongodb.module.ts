import { Db, MongoClient } from 'mongodb';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MConnection } from './mongodb.dto';
import { MONGODB_PROVIDER } from 'src/commons/constants';
import { MongoConfigs } from 'src/configs/configs.type';

const databaseProvider = {
	provide: MONGODB_PROVIDER,
	useFactory: async (configService: ConfigService): Promise<MConnection> => {
		try {
			const mConfigs = configService.get<MongoConfigs>('mongo');

			const uri = `mongodb+srv://${mConfigs.user}:${mConfigs.password}@${mConfigs.host}/${mConfigs.name}`;

			const client: MongoClient = new MongoClient(uri);

			await client.connect();

			const dbInstance: Db = client.db(mConfigs.name);

			return { mClient: client, mDbInstance: dbInstance };
		} catch (e) {
			throw e;
		}
	},
	inject: [ConfigService],
};

@Global()
@Module({
	imports: [ConfigModule],
	providers: [databaseProvider],
	exports: [databaseProvider],
})
export class DatabaseModule { }
