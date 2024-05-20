import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import { TaskController } from './task.controller';

@Module({
	providers: [TaskService, TaskRepository],
	controllers: [TaskController],
})
export class TaskModule { }
