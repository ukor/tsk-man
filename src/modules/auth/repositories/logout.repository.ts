import { Inject, Injectable } from '@nestjs/common';
import { MConnection } from '../../mongodb/mongodb.dto';
import { ConfigService } from '@nestjs/config';
import { Db, ObjectId } from 'mongodb';
import { CollectionNames, MONGODB_PROVIDER } from '../../../commons/constants';
import { MongoConfigs } from '../../../configs/configs.type';
import { DatabaseException } from '../../../commons/exceptions/database.exception';

@Injectable()
export class LogoutRepository {
	// ---

	private dbInstance: Db;

	constructor(
		@Inject(MONGODB_PROVIDER) private mConnection: MConnection,
		private readonly configService: ConfigService,
	) {
		// ---

		const mConfigs = this.configService.getOrThrow<MongoConfigs>('mongo');

		this.dbInstance = mConnection.mClient.db(mConfigs.name);
	}

	async killSession(userId: string, sessionId: string) {
		// ---

		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			const sessionIdAsObjectId = new ObjectId(sessionId);

			const userIdAsObjectId = new ObjectId(userId);

			const result = await this.dbInstance
				.collection(CollectionNames.Sessions)
				.updateOne(
					{
						_id: sessionIdAsObjectId,
						userId: userIdAsObjectId,
					},
					{
						$set: {
							status: 'inactive',
							logoutAt: new Date(),
						},
					},
				);

			if (result.modifiedCount === 0) {
				// ---
				// Do not stop the flow of excution but log this
				// TODO
			}

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: `logout:kill-session`,
					entityId: new ObjectId(userId),
					owner: `user:${userId}`,
					by: 'user',
					at: new Date(),
				});

			session.commitTransaction();

			return result.modifiedCount === 1;
		} catch (exception) {
			// Log this as it is a database error;

			await session.abortTransaction();
			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			// ---

			await session.endSession();
		}
	}
}
