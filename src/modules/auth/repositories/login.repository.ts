import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MConnection } from '../../mongodb/mongodb.dto';
import { ConfigService } from '@nestjs/config';
import { Db, FindOptions, ObjectId } from 'mongodb';
import { MongoConfigs } from '../../../configs/configs.type';
import { DatabaseException } from '../../../commons/exceptions/database.exception';
import { CollectionNames, MONGODB_PROVIDER } from '../../../commons/constants';
import { UserDeviceDto } from '../../../commons/dtos/user-device.dto';
import { UserCredentials, UserStatus } from '../../user/dtos/user.dto';

@Injectable()
export class LoginRepository {
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

	async getUserCredentialsWithEmail(email: string): Promise<UserCredentials> {
		// ---

		const opts: FindOptions = {
			projection: {
				_id: 1,
				email: 1,
				phone: 1,
				firstName: 1,
				password: 1,
				status: 1,
				userRole: 1,
			},
		};

		const emailStates: string[] = [
			UserStatus.added_email.toString(),
			UserStatus.verified_email.toString(),
			UserStatus.active.toString(),
		];

		const user = await this.dbInstance
			.collection(CollectionNames.Users)
			.findOne<UserCredentials>(
				{
					'email.address': email,
					status: { $in: emailStates },
				},
				opts,
			);

		if (user === null) {
			throw new UnauthorizedException(
				'Invalid login credentials. Check that you are entering the right details',
			);
		}

		return user;
	}

	async logRequest(
		userId: string,
		deviceDetails: UserDeviceDto,
		deviceHash: string,
		type: 'email' | 'phone' | 'google' | 'facebook',
	) {
		// ---

		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			const sessionId = new ObjectId();

			const userIdAsObjectId = new ObjectId(userId);

			await this.dbInstance.collection(CollectionNames.Sessions).insertOne({
				_id: sessionId,
				userId: userIdAsObjectId,
				loginAt: new Date(),
				deviceDetails: deviceDetails,
				deviceHash,
				status: 'active',
			});

			// --- add log to ops log;
			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: `login:${type}`,
					entityId: new ObjectId(userId),
					owner: `user:${userId}`,
					by: 'system',
					at: new Date(),
				});

			session.commitTransaction();

			return sessionId.toString();
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
