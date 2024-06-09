import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { SharedService } from '../shared/shared.service';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { LoginRepository } from './repositories/login.repository';
import { LogoutRepository } from './repositories/logout.repository';
import { LogoutService } from './services/logout.service';
import { SignupRepository } from './repositories/signup.repositry';

@Module({
	imports: [SharedModule],
	controllers: [AuthController],
	providers: [
		SignupRepository,
		SignUpService,
		LoginRepository,
		LoginService,
		ConfigService,
		SharedService,
		LogoutRepository,
		LogoutService,
	],
})
export class AuthModule { }
