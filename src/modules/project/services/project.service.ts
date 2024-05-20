import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
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
}
