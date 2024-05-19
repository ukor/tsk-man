import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { HttpBaseResponse } from '../../../commons/dtos/http-response.dto';
import { UserDeviceDto } from '../../../commons/dtos/user-device.dto';
import { AuthenticationNextStep } from './auth-step.dto';

export class LoginRequest {
	// ---

	@ApiProperty({
		example: 'example@gmail.com',
		required: true,
	})
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@ApiProperty({ required: true, example: 'qaws3ed!' })
	@IsNotEmpty()
	readonly password: string;

	@ApiProperty({
		type: () => UserDeviceDto,
		description: 'Details about the device this user is making request from',
	})
	@IsOptional()
	readonly device: UserDeviceDto;

	constructor(arg: Required<LoginRequest>) {
		Object.assign(this, arg);
	}
}

export class LoginResponse {
	@ApiProperty()
	readonly token: string;

	@ApiProperty()
	readonly userId: string;

	@ApiProperty({ enum: AuthenticationNextStep })
	readonly next: AuthenticationNextStep;

	constructor(arg: Required<LoginHttpResponse>) {
		// ---

		Object.assign(this, arg);
	}
}

export class LoginHttpResponse extends HttpBaseResponse {
	// ---

	@ApiProperty({
		type: () => LoginResponse,
	})
	readonly payload: LoginResponse;

	constructor(arg: Required<LoginHttpResponse>) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}
