import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEmpty,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';
import { HttpBaseResponse } from '../../../commons/dtos/http-response.dto';

export enum TaskState {
	todo = 'todo',
	progress = 'progress',
	done = 'done',
}

export enum TaskStatus {
	active = 'active',
	deleted = 'deleted',
}

export class TaskBase {
	// ---

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	description: string;

	constructor(arg: any) {
		// ---

		Object.assign(this, arg);
	}
}

export class CreateTaskRequestPayload extends TaskBase {
	// ---

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	dueDate: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	projectId: string;

	@ApiProperty({ isArray: true })
	@IsArray()
	@IsOptional()
	tags: Record<string, string>[];

	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}

export class TaskDto extends CreateTaskRequestPayload {
	// ---

	@ApiProperty()
	taskId: string;

	@ApiProperty()
	authorId: string;

	@ApiProperty({ type: () => Date })
	createdAt: Date;

	@ApiProperty({ type: () => Date })
	updatedAt: Date;

	@ApiProperty({ enum: TaskState })
	state: TaskState;

	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}

export class TaskResponse extends HttpBaseResponse {
	// ---

	@ApiProperty({ type: () => TaskDto })
	payload: TaskDto;

	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}

export class TaskWithSubCategory {
	// ---

	@ApiProperty({ type: () => TaskDto, isArray: true })
	todo: TaskDto[];

	@ApiProperty({ type: () => TaskDto, isArray: true })
	progress: TaskDto[];

	@ApiProperty({ type: () => TaskDto, isArray: true })
	done: TaskDto[];
}

export class TaskWithSubCategoryResponse extends HttpBaseResponse {
	@ApiProperty({ type: () => TaskWithSubCategory })
	payload: TaskWithSubCategory;

	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}
