import { ObjectId } from 'mongodb';
import { TaskBase, TaskState, TaskStatus } from '../dtos/task.dto';

export class TaskEntity extends TaskBase {
	// ---

	_id: ObjectId;

	projectId: ObjectId;

	authorId: ObjectId;

	dueDate: Date;

	createdAt: Date;

	updatedAt: Date;

	state: TaskState;

	status: TaskStatus;

	tags: Record<string, string>[];

	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}
