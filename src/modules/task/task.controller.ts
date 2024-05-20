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
	ApiBody,
	ApiCreatedResponse,
	ApiDefaultResponse,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../../commons/decorators/authenticated-user.decorator';
import { AuthUser } from '../../commons/dtos/authenticated-user.dto';
import { HttpDefaultResponse } from '../../commons/dtos/http-response.dto';
import { AuthorizationGuard } from '../../commons/guards/authorization.guard';
import { CreateTaskRequestPayload, TaskResponse } from './dtos/task.dto';
import { TaskService } from './services/task.service';

@ApiTags('task')
@ApiSecurity('uid')
@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) { }

	@Post('create')
	@HttpCode(HttpStatus.OK)
	@ApiCreatedResponse({ type: TaskResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
	@ApiBody({ type: () => CreateTaskRequestPayload })
	async createProject(
		@AuthenticatedUser() aUser: AuthUser,
		@Body() body: CreateTaskRequestPayload,
	) {
		// ---

		const result = await this.taskService.add(body, aUser.userId);

		return {
			isError: false,
			message: `Task has been added successfully`,
			description: '',
			context: 'ok',
			payload: result,
		};
	}
}
