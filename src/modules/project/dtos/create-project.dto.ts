import { ApiProperty } from '@nestjs/swagger';
import { HttpBaseResponse } from '../../../commons/dtos/http-response.dto';
import { ProjectBase, ProjectStatus } from '../entities/create-project.entity';

export class ProjectDto extends ProjectBase {
	// ---

	@ApiProperty({ enum: ProjectStatus })
	status: ProjectStatus;

	@ApiProperty({ description: 'Unique identifier for the project' })
	projectId: string;

	@ApiProperty({
		description: 'Unique identifier of the user who created this project',
	})
	createdBy: string;

	@ApiProperty({ type: () => Date })
	createdAt: Date;

	@ApiProperty({ type: () => Date })
	updatedAt: Date;

	constructor(arg: any) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}

export class ProjectResponse extends HttpBaseResponse {
	// ---

	@ApiProperty({
		type: () => ProjectDto,
		description: 'A map matching project details to it corresponding values',
	})
	payload: ProjectDto;

	constructor(arg: any) {
		super(arg);

		Object.assign(this, arg);
	}
}

export class ProjectsWithPagination {
	// ---

	@ApiProperty({
		type: () => ProjectDto,
		isArray: true,
		description: 'An array of projects with it corresponding values',
	})
	projects: ProjectDto[];

	@ApiProperty({
		nullable: true,
		description:
			'An object that stores the the position of the client while navigating through a large project list (TODO)',
	})
	paginationCursor: unknown;

	constructor(arg: any) {
		Object.assign(this, arg);
	}
}

export class ProjectsResponse extends HttpBaseResponse {
	// ---

	@ApiProperty({
		type: () => ProjectsWithPagination,
		description: '',
	})
	payload: ProjectsWithPagination;

	constructor(arg: any) {
		super(arg);

		Object.assign(this, arg);
	}
}
