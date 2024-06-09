import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ProjectDto, ProjectsWithPagination } from '../dtos/create-project.dto';
import {
	CreateProjectRequestPayload,
	ProjectEntity,
	ProjectStatus,
} from '../entities/create-project.entity';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class ProjectService {
	constructor(private readonly projectRepository: ProjectRepository) { }

	async create(userId: string, arg: CreateProjectRequestPayload) {
		// ---

		const entity: ProjectEntity = {
			status: ProjectStatus.active,
			_id: new ObjectId(),
			createdBy: new ObjectId(userId),
			createdAt: new Date(),
			updatedAt: new Date(),
			name: arg.name,
			description: arg.description,
		};

		const project = await this.projectRepository.createProject(entity);

		return project;
	}

	async getUserProject(userId: string, projectId: string): Promise<ProjectDto> {
		// ---

		const result = await this.projectRepository.getProjectByUser(
			userId,
			projectId,
		);

		if (result === null) {
			throw new NotFoundException('The project does not exist');
		}

		const { _id, ...rest } = result;

		const project: ProjectDto = {
			...rest,
			createdBy: result.createdBy.toString(),
			projectId: _id.toString(),
		};

		return project;
	}

	async getUserProjects(userId: string): Promise<ProjectsWithPagination> {
		// ---

		const result = await this.projectRepository.getProjectsByUser(userId);

		const projectCardinal = result.length;

		if (projectCardinal === 0) {
			throw new NotFoundException("You currently don't have any project");
		}

		const projects: ProjectDto[] = [];

		for (let i = 0; i < projectCardinal; i++) {
			const { _id, ...rest } = result[i];

			projects.push({
				...rest,
				createdBy: result[i].createdBy.toString(),
				projectId: _id.toString(),
			});
		}

		return {
			projects,
			paginationCursor: null,
		};
	}
}
