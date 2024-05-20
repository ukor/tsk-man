import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiDefaultResponse,
	ApiOkResponse,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../../commons/decorators/authenticated-user.decorator';
import { AuthUser } from '../../commons/dtos/authenticated-user.dto';
import {
	HttpBooleanResponse,
	HttpDefaultResponse,
} from '../../commons/dtos/http-response.dto';
import { AuthorizationGuard } from '../../commons/guards/authorization.guard';
import {
	ChangeTaskRequestPayload,
	CreateTaskRequestPayload,
	DeleteTaskRequestPayload,
	TaskResponse,
} from './dtos/task.dto';
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
	async addTask(
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

	@Put('state')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: HttpBooleanResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
	@ApiBody({ type: () => ChangeTaskRequestPayload })
	async updateTaskState(
		@AuthenticatedUser() aUser: AuthUser,
		@Body() body: ChangeTaskRequestPayload,
	) {
		// ---

		const result = await this.taskService.changeTaskState(
			aUser.userId,
			body.projectId,
			body.taskId,
			body.taskState,
		);

		return {
			isError: false,
			message: `Task has been added successfully`,
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Delete('')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: HttpBooleanResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(AuthorizationGuard)
	@ApiBody({ type: () => DeleteTaskRequestPayload })
	async deleteTask(
		@AuthenticatedUser() aUser: AuthUser,
		@Body() body: DeleteTaskRequestPayload,
	) {
		// ---

		const result = await this.taskService.deleteTask(
			aUser.userId,
			body.projectId,
			body.taskId,
		);

		return {
			isError: false,
			message: `Task has been deleted successfully`,
			description: '',
			context: 'ok',
			payload: result,
		};
	}
}
