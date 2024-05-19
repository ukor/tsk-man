import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter, FindOptions, ObjectId } from 'mongodb';
import { MConnection } from '../../mongodb/mongodb.dto';
import { ConfigService } from '@nestjs/config';
import { CollectionNames, MONGODB_PROVIDER } from '../../../commons/constants';
import { DatabaseException } from '../../../commons/exceptions/database.exception';
import {
	UserEntity,
	UserEntityWithoutSensitiveData,
	UserStatus,
} from '../../user/dtos/user.dto';
import { UserDeviceDto } from '../../../commons/dtos/user-device.dto';
import { MongoConfigs } from '../../../configs/configs.type';

@Injectable()
export class SignupRepository {
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

	async getUserWithEmailAddress(
		emailAddr: string,
	): Promise<UserEntityWithoutSensitiveData | null> {
		// ---

		const opts: FindOptions = {
			projection: {
				password: 0,
				// updatedAt: 0,
			},
		};

		const user = await this.dbInstance
			.collection(CollectionNames.Users)
			.findOne<UserEntityWithoutSensitiveData>(
				{
					'email.address': emailAddr,
					status: { $ne: UserStatus.deleted },
				},
				opts,
			);

		return user;
	}

	async setEmailAndPassword(
		emailAddr: string,
		hashedPassword: string,
	): Promise<ObjectId> {
		// ---

		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			const userCollection = this.dbInstance.collection(CollectionNames.Users);

			const userIdAsObjectId = new ObjectId();

			await userCollection.insertOne({
				_id: userIdAsObjectId,
				email: {
					address: emailAddr,
					isVerified: false,
				},
				password: hashedPassword,
				status: UserStatus.added_email,
				updatedAt: new Date(),
			});

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: 'signup_email_address:add',
					entityId: userIdAsObjectId,
					owner: `user:${userIdAsObjectId.toString()}`,
					by: 'user',
					at: new Date(),
				});

			// --- LOGIC END
			session.commitTransaction();

			return userIdAsObjectId;
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}

	async setEmailVerificationState(
		emailAddr: string,
		userId: string,
		deviceDetails: UserDeviceDto,
		deviceHash: string,
	) {
		// ---

		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			const userIdAsObjectId = new ObjectId(userId);

			const filter: Filter<UserEntity> = {
				_id: userIdAsObjectId,
				'email.address': emailAddr,
			};

			const result = await this.dbInstance
				.collection(CollectionNames.Users)
				.updateOne(filter, {
					$set: {
						'email.isVerified': true,
						updatedAt: new Date(),
						status: UserStatus.verified_email,
					},
				});

			if (result.modifiedCount === 0) {
				// --- TODO
				// throw new DatabaseError('There was an issue modifing phone number verification status. Try again later.');
			}

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: 'signup_email_address:verified',
					entityId: userIdAsObjectId,
					owner: `user:${userId}`,
					by: 'user',
					at: new Date(),
				});

			const sessionId = new ObjectId();

			await this.dbInstance.collection(CollectionNames.Sessions).insertOne({
				_id: sessionId,
				userId: userIdAsObjectId,
				loginAt: new Date(),
				deviceDetails: deviceDetails,
				deviceHash,
				status: 'active',
			});

			// --- LOGIC END
			session.commitTransaction();

			return {
				userId,
				sessionId: sessionId.toString(),
			};
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}

	async logOperation() {
		// ---

		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			// --- LOGIC END
			session.commitTransaction();
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}
}
