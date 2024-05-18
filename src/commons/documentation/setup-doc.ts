import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import packageJson from '../../../package.json';
import path from 'path';
import fs from 'fs/promises';
import { isProduction } from '../../configs';
import { AppConfig } from 'src/configs/configs.type';

export class Documentation {
	// ---

	private readonly document = new DocumentBuilder();
	private readonly env: AppConfig['appEnv'];
	private readonly config: ConfigService<AppConfig>; //= new ConfigService();
	private readonly swaggerDocs: OpenAPIObject;

	constructor(private readonly app: INestApplication) {
		// ---

		this.config = app.get(ConfigService);

		this.document.setTitle(`${packageJson.name} API`);
		this.document.setDescription('');
		this.document.setVersion(packageJson.version);

		this.document.addSecurity('uid', {
			type: 'apiKey',
			name: 'x-uid',
			in: 'header',
		});

		this.document.addBearerAuth();

		const port = this.config.getOrThrow<number>('port');
		this.document.addTag('x-service-port', port.toString());

		this.env = this.config.getOrThrow('appEnv');

		this.swaggerDocs = SwaggerModule.createDocument(
			this.app,
			this.document.build(),
		);
	}

	async serve() {
		if (!isProduction(this.env)) {
			SwaggerModule.setup('/v1/api-docs', this.app, this.swaggerDocs);
		}
	}

	async generateOpenApi() {
		if (!isProduction(this.env)) {
			await fs.writeFile(
				path.resolve(process.cwd(), 'openapi.json'),
				JSON.stringify(this.swaggerDocs),
			);
			// await OpenApiNestFactory.configure(this.app, this.document, options);
		}
	}
}
