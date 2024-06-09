import { ValidationPipeOptions } from '@nestjs/common';

export const validationOption: ValidationPipeOptions = {
	enableDebugMessages: true,
	transform: true,
	whitelist: true,
	forbidNonWhitelisted: true,
};
