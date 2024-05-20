import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
	CreateTaskRequestPayload,
	TaskDto,
	TaskState,
	TaskStatus,
} from '../dtos/task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class TaskService {
	// ---

	constructor(private readonly taskRepository: TaskRepository) { }

	async add(task: CreateTaskRequestPayload, userId: string): Promise<TaskDto> {
		// ---

		const entity: TaskEntity = {
			_id: new ObjectId(),
			projectId: new ObjectId(task.projectId),
			authorId: new ObjectId(userId),
			dueDate: this.parseDate(task.dueDate),
			createdAt: new Date(),
			updatedAt: new Date(),
			state: TaskState.todo,
			status: TaskStatus.active,
			tags: task.tags ?? [],
			title: task.title,
			description: task.description,
		};

		const result = await this.taskRepository.createTask(entity);

		return result;
	}

	private parseDate(date: string) {
		// ---

		const d = date.split(',');

		if (d.length !== 3) {
			throw new BadRequestException('Invalid date of birth passed.');
		}

		const day = d[0]; // dd
		const month = d[1]; // MM
		const year = d[2]; // yyyy

		// This may look redundant - trust me strange things happens when you work with date

		if (day.length !== 2) {
			throw new BadRequestException(
				'Invalid day format passed as date of birth',
				{
					cause: new Error('Day must follow this format dd'),
				},
			);
		}

		if (month.length !== 2) {
			throw new BadRequestException(
				'Invalid month format passed as date of birth',
				{
					cause: new Error('Month must follow this format MM'),
				},
			);
		}

		if (year.length !== 4) {
			throw new BadRequestException('Invalid Year passed as date of birth', {
				cause: new Error('Year must take this format, yyyy'),
			});
		}

		return new Date(parseInt(year), parseInt(month) - 1, parseInt(day) + 1);
	}
}
