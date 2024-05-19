import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { HttpDefaultResponse } from '../../../commons/dtos/http-response.dto';

export class LogoutHttpReponse extends HttpDefaultResponse {
	// ---

	@ApiProperty({
		description:
			'boolean value representing if the session was successfully killed',
	})
	@IsBoolean()
	readonly payload: boolean;

	constructor(arg: Required<LogoutHttpReponse>) {
		// ---

		super(arg);

		Object.assign(this, arg);
	}
}
