import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectService } from './services/project.service';

@Module({
	imports: [SharedModule],
	controllers: [ProjectController],
	providers: [ProjectRepository, ProjectService],
})
export class ProjectModule { }
