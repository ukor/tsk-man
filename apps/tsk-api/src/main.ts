import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Documentation } from './commons/documentation/setup-doc';
import { AllExceptionsFilter } from './commons/filters/all-exception.filter';
import { validationOption } from './configs/validation-pipe.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(helmet());

	app.useGlobalPipes(new ValidationPipe(validationOption));

	const configService = app.get(ConfigService);
	const port = configService.get<number>('port');

	/**
	 * See [Versioning and Swagger](https://github.com/nestjs/swagger/issues/1495#issuecomment-898311614)
	 */
	app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'v',
		defaultVersion: '1',
	});

	const apidocs = new Documentation(app);
	await apidocs.generateOpenApi();
	await apidocs.serve();

	const httpAdapter = app.get(HttpAdapterHost);

	app.useGlobalFilters(
		new AllExceptionsFilter(httpAdapter, new ConsoleLogger()),
	);

	await app.listen(port);

	console.info(
		'\x1b[44m%s\x1b[0m',
		'info',
		'Tsk-man Service',
		`http://localhost:${port}`,
	);

	console.info(
		'\x1b[44m%s\x1b[0m',
		'info',
		'TSK-Man Documentation',
		`http://localhost:${port}/v1/api-docs`,
	);
}
bootstrap();
