import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiDefaultResponse,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../../commons/decorators/authenticated-user.decorator';
import { AuthUser } from '../../commons/dtos/authenticated-user.dto';
import { HttpDefaultResponse } from '../../commons/dtos/http-response.dto';
import { AuthorizationGuard } from '../../commons/guards/authorization.guard';
import { CreateProjectResponse } from './dtos/create-project.dto';
import { CreateProjectRequestPayload } from './entities/create-project.entity';
import { ProjectService } from './services/project.service';

@ApiTags('project')
@ApiSecurity('uid')
@Controller('project')
export class ProjectController {
	constructor(private projectService: ProjectService) { }

	@Post('create')
	@HttpCode(HttpStatus.OK)
	@ApiCreatedResponse({ type: CreateProjectResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
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
}
