import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export enum ProjectStatus {
	deleted = 'deleted',
	active = 'active',
}

export class CreateProjectRequestPayload {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@Optional()
	description: string;

	// @ApiProperty({
	// 	description:
	// 		'This is a derived field. The value from JWT token will replace any value passed by the client',
	// })
	// @IsOptional()
	// createdBy: string;

	constructor(arg: any) {
		// ---

		Object.assign(this, arg);
	}
}

export class ProjectBase extends CreateProjectRequestPayload {
	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}

export class ProjectEntity extends ProjectBase {
	// ---

	status: ProjectStatus;

	@Type(() => ObjectId)
	_id: ObjectId;

	@Type(() => ObjectId)
	createdBy: ObjectId;

	@Type(() => Date)
	createdAt: Date;

	@Type(() => Date)
	updatedAt: Date;

	constructor(arg: any) {
		// ---
		super(arg);
		Object.assign(this, arg);
	}
}
