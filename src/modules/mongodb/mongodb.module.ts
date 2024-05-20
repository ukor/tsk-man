import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MConnection } from './mongodb.dto';
import { MongoConfigs } from '../../configs/configs.type';
import { MONGODB_PROVIDER } from '../../commons/constants';

const databaseProvider = {
	provide: MONGODB_PROVIDER,
	useFactory: async (configService: ConfigService): Promise<MConnection> => {
		try {
			const mConfigs = configService.get<MongoConfigs>('mongo');

			const uri = `mongodb+srv://${mConfigs.user}:${mConfigs.password}@${mConfigs.host}/${mConfigs.name}`;

			const client: MongoClient = new MongoClient(uri, {
				serverApi: {
					version: ServerApiVersion.v1,
					strict: true,
					deprecationErrors: true,
				},
			});

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
