import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, ObjectId } from 'mongodb';
import { CollectionNames, MONGODB_PROVIDER } from '../../../commons/constants';
import { DatabaseException } from '../../../commons/exceptions/database.exception';
import { MongoConfigs } from '../../../configs/configs.type';
import { MConnection } from '../../mongodb/mongodb.dto';
import { TaskDto, TaskState, TaskStatus } from '../dtos/task.dto';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TaskRepository {
	private dbInstance: Db;

	constructor(
		@Inject(MONGODB_PROVIDER) private mConnection: MConnection,
		private readonly configService: ConfigService,
	) {
		// ---

		const mConfigs = this.configService.getOrThrow<MongoConfigs>('mongo');

		this.dbInstance = mConnection.mClient.db(mConfigs.name);
	}

	async createTask(entity: TaskEntity): Promise<TaskDto> {
		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			const projectCollection = this.dbInstance.collection(
				CollectionNames.Task,
			);

			await projectCollection.insertOne(entity);

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: 'task:add',
					entityId: entity._id,
					owner: `user:${entity.authorId.toString()}`,
					by: 'user',
					at: new Date(),
				});

			// --- LOGIC END
			session.commitTransaction();

			const t: TaskDto = {
				...entity,
				dueDate: entity.dueDate.toString(),
				taskId: entity._id.toString(),
				projectId: entity.projectId.toString(),
				authorId: entity.authorId.toString(),
			};

			return t;
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}

	async getProjectTask(projectId: string): Promise<TaskEntity[]> {
		// ---

		const projectIdAsObjectId = new ObjectId(projectId);

		console.log({ projectIdAsObjectId, projectId });

		const projects = await this.dbInstance
			.collection(CollectionNames.Task)
			.find<TaskEntity>({
				projectId: projectIdAsObjectId,
			})
			.toArray();

		console.log(projects);

		return projects;
	}

	async updateTaskState(
		taskId: string,
		projectId: string,
		userId: string,
		state: TaskState,
	): Promise<boolean> {
		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			const projectCollection = this.dbInstance.collection(
				CollectionNames.Task,
			);

			const result = await projectCollection.updateOne(
				{
					_id: new ObjectId(taskId),
					projectId: new ObjectId(projectId),
					status: TaskStatus.active,
				},
				{ $set: { state, updatedAt: new Date() } },
			);

			if (result.modifiedCount === 0) {
				throw new BadRequestException(
					'Task entry could not be edited. It is either the task does not exist or it is in an inactive state.',
				);
			}

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: 'task:change-status',
					entityId: new ObjectId(projectId),
					owner: `user:${userId}`,
					by: 'user',
					at: new Date(),
				});

			// --- LOGIC END
			session.commitTransaction();

			return result.modifiedCount > 0;
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}

	async deleteTask(
		taskId: string,
		projectId: string,
		userId: string,
	): Promise<boolean> {
		const session = this.mConnection.mClient.startSession();

		try {
			session.startTransaction();

			// --- LOGIC

			const projectCollection = this.dbInstance.collection(
				CollectionNames.Task,
			);

			const result = await projectCollection.updateOne(
				{
					_id: new ObjectId(taskId),
					projectId: new ObjectId(projectId),
					status: TaskStatus.active,
				},
				{ $set: { status: TaskStatus.deleted, updatedAt: new Date() } },
			);

			if (result.modifiedCount === 0) {
				throw new BadRequestException(
					'Task entry could not be deleted. It is either the task does not exist or it is in an inactive state.',
				);
			}

			await this.dbInstance
				.collection(CollectionNames.OperationsLog)
				.insertOne({
					ops: 'task:delete',
					entityId: new ObjectId(projectId),
					owner: `user:${userId}`,
					by: 'user',
					at: new Date(),
				});

			// --- LOGIC END
			session.commitTransaction();

			return result.modifiedCount > 0;
		} catch (exception) {
			// --- Database error

			await session.abortTransaction();

			throw new DatabaseException(exception, this.constructor.name);
		} finally {
			await session.endSession();
		}
	}
}
