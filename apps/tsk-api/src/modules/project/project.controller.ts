import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiDefaultResponse,
	ApiOkResponse,
	ApiQuery,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../../commons/decorators/authenticated-user.decorator';
import { AuthUser } from '../../commons/dtos/authenticated-user.dto';
import { HttpDefaultResponse } from '../../commons/dtos/http-response.dto';
import { AuthorizationGuard } from '../../commons/guards/authorization.guard';
import { ProjectResponse, ProjectsResponse } from './dtos/create-project.dto';
import { CreateProjectRequestPayload } from './entities/create-project.entity';
import { ProjectService } from './services/project.service';

@ApiTags('project')
@ApiSecurity('uid')
@Controller('project')
export class ProjectController {
	constructor(private projectService: ProjectService) { }

	@Post('create')
	@HttpCode(HttpStatus.OK)
	@ApiCreatedResponse({ type: ProjectResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
	@ApiBody({ type: () => CreateProjectRequestPayload })
	async createProject(
		@AuthenticatedUser() aUser: AuthUser,
		@Body() body: CreateProjectRequestPayload,
	) {
		// ---

		const result = await this.projectService.create(aUser.userId, {
			...body,
		});

		return {
			isError: false,
			message: `Project ${body.name} has been created successfully`,
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Get('')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: ProjectResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
	@ApiQuery({ name: 'projectId' })
	async getProject(
		@AuthenticatedUser() aUser: AuthUser,
		@Query('projectId') projectId: string,
	) {
		// ---

		const result = await this.projectService.getUserProject(
			aUser.userId,
			projectId.trim(),
		);

		return {
			isError: false,
			message: ``,
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Get('projects')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: ProjectsResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
	async getProjects(@AuthenticatedUser() aUser: AuthUser) {
		// ---

		const projects = await this.projectService.getUserProjects(aUser.userId);

		return {
			isError: false,
			message: ``,
			description: '',
			context: 'ok',
			payload: projects,
		};
	}
}
