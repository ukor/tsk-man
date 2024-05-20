import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurations } from './configs';
import { AuthModule } from './modules/auth/auth.module';

import { DatabaseModule } from './modules/mongodb/mongodb.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: true,
			load: [configurations],
		}),
		DatabaseModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
