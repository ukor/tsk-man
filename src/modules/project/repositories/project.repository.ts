import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, ObjectId } from 'mongodb';
import { CollectionNames, MONGODB_PROVIDER } from '../../../commons/constants';
import { DatabaseException } from '../../../commons/exceptions/database.exception';
import { MongoConfigs } from '../../../configs/configs.type';
import { MConnection } from '../../mongodb/mongodb.dto';
import { ProjectDto } from '../dtos/create-project.dto';
import { ProjectEntity } from '../entities/create-project.entity';

@Injectable()
export class ProjectRepository {
	private dbInstance: Db;

	constructor(
		@Inject(MONGODB_PROVIDER) private mConnection: MConnection,
		private readonly configService: ConfigService,
	) {
		// ---

		const mConfigs = this.configService.getOrThrow<MongoConfigs>('mongo');

		this.dbInstance = mConnection.mClient.db(mConfigs.name);
	}

	async createProject(entity: ProjectEntity): Promise<ProjectDto> {
		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			const projectCollection = this.dbInstance.collection(
				CollectionNames.Project,
			);

			await projectCollection.insertOne(entity);

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: 'project:add',
					entityId: entity._id,
					owner: `user:${entity.createdBy.toString()}`,
					by: 'user',
					at: new Date(),
				});

			// --- LOGIC END
			session.commitTransaction();

			const p: ProjectDto = {
				...entity,
				projectId: entity._id.toString(),
				createdBy: entity.createdBy.toString(),
			};

			return p;
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}

	async getProjectByUser(userId: string) { }

	async getProjectsByUser(userId: string) { }
}
