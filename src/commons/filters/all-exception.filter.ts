import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpDefaultResponse } from '../dtos/http-response.dto';
import { DatabaseException } from '../exceptions/database.exception';
import { MongoError } from 'mongodb';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	// ---

	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly logger: LoggerService,
	) { }

	private isJavascriptError(error: any): boolean {
		return (
			error instanceof ReferenceError ||
			error instanceof TypeError ||
			error instanceof URIError ||
			error instanceof RangeError ||
			error instanceof SyntaxError
		);
	}

	private isCriticalError(error: unknown) {
		// ---

		// See Mongo Error docs
		// https://github.com/mongodb/node-mongodb-native/blob/HEAD/etc/notes/errors.md
		//

		return (
			error instanceof DatabaseException ||
			error instanceof MongoError ||
			error instanceof InternalServerErrorException
		);
	}

	private logCriticalError(error: unknown) {
		// ---

		if (error instanceof DatabaseException) {
			// send log to google cloud logger
			//

			this.logger.error(error.cause, { description: error?.description });

			return;
		}

		// [TODO] - @ukor - seem redundant - perform more test
		if (error instanceof InternalServerErrorException) {
			this.logger.error(error.message);

			return;
		}

		this.logger.error(error);

		return;
	}

	catch(exception: unknown, host: ArgumentsHost): void {
		// ---

		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();
		const path = httpAdapter.getRequestUrl(ctx.getRequest());

		let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody: HttpDefaultResponse = {
			// TODO - description should only bge populated in dev and staging environment
			description: `Error occured at ${path}. - See logger for more details`,
			message: 'We messed up on our end.',
			context: String(HttpStatus[httpStatus]).toString() ?? 'server_error',
			isError: true,
			payload: null,
		};

		console.log(exception, '<<< exception');

		if (exception instanceof JsonWebTokenError) {
			// ---
			httpStatus = HttpStatus.UNAUTHORIZED;

			const m = path.includes('/verify')
				? 'Invalid verification credentials. Try again'
				: 'Your session has expired. try loging in again';

			responseBody.message = m;

			responseBody.context = String(
				HttpStatus[HttpStatus.UNAUTHORIZED],
			).toLowerCase();
		}

		this.logCriticalError(exception);

		if (this.isCriticalError(exception)) {
			const msg =
				exception instanceof HttpException
					? exception.message
					: 'There was an error from our end. Try again later';

			responseBody.message = msg;

			responseBody.description = `${msg} - ${responseBody.description}`;
		}

		if (this.isJavascriptError(exception)) {
			// ---
			// TODO - send to google cloud log or grafana

			responseBody.message =
				'We messed up on our end. We are working to resolve this issue. Try again later.';

			responseBody.description = `[lang-error] ${responseBody.description}`;

			responseBody.context = 'server_error';
		}

		const response = ctx.getResponse<Response>();

		if (exception instanceof HttpException) {
			httpStatus = exception.getStatus();

			const exceptionResponse = exception.getResponse(); // {error: string, message: string, statusCode: number}

			// console.log(exceptionResponse, '<<< exception response HttpException');

			responseBody.context = String(HttpStatus[httpStatus]).toLowerCase();

			responseBody.message = exception.message;
		}

		// this.logger.error({ ...error, httpStatus, path });

		httpAdapter.reply(response, responseBody, httpStatus);
	}
}
