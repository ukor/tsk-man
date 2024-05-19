import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
// import { UserService } from '../user/user.service';
import {
	ApiBearerAuth,
	ApiDefaultResponse,
	ApiOkResponse,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import {
	OtpVerificationHttpResponse,
	RegisterSetEmailAndPassword,
	SetEmailAndPasswordHttpResponse,
	VerifyPhoneNumberOrEmailAddressDto,
} from './dto/sign-up.dto';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { LoginHttpResponse, LoginRequest } from './dto/login.dto';
import { LogoutService } from './services/logout.service';
import { LogoutHttpReponse } from './dto/logout.dto';
import { HttpDefaultResponse } from '../../commons/dtos/http-response.dto';
import { AuthorizationGuard } from '../../commons/guards/authorization.guard';
import { AuthenticatedUser } from '../../commons/decorators/authenticated-user.decorator';
import { VerifyOtpGuard } from '../../commons/guards/verify-otp.gaurd';
import { AuthUser } from '../../commons/dtos/authenticated-user.dto';

@ApiTags('auth')
@ApiSecurity('uid')
@Controller('auth')
export class AuthController {
	constructor(
		private loginService: LoginService,
		private signupService: SignUpService,
		private logoutService: LogoutService,
	) { }

	@Post('sign-up/email')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: SetEmailAndPasswordHttpResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(VerifyOtpGuard)
	async setEmailAndPassword(
		@AuthenticatedUser() aUser: AuthUser,
		@Body() body: RegisterSetEmailAndPassword,
	) {
		// ---

		const result = await this.signupService.setEmailAndPassword(body);

		return {
			isError: false,
			message: 'A six digital chgaracter has been sent to your email address',
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Post('verify/email')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: OtpVerificationHttpResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	@UseGuards(VerifyOtpGuard)
	async verifyEmail(@Body() body: VerifyPhoneNumberOrEmailAddressDto) {
		// ---

		const result = await this.signupService.verifyEmailAddress(body);

		return {
			isError: false,
			message: 'Your email address has been verified successfully',
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Post('login/request')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: LoginHttpResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	async login(@Body() credentials: LoginRequest): Promise<LoginHttpResponse> {
		// ---

		const result = await this.loginService.loginRequest(credentials);

		return {
			isError: false,
			message: 'An 6 digital character has been sent to your email',
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Post('login/2fa-verification')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: OtpVerificationHttpResponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@UseGuards(VerifyOtpGuard)
	@ApiBearerAuth()
	async verifyLogin(
		@Body() body: VerifyPhoneNumberOrEmailAddressDto,
	): Promise<OtpVerificationHttpResponse> {
		// ---

		const result = await this.loginService.twoFaVerification(body);

		return {
			isError: false,
			message: 'Login is successfully',
			description: '',
			context: 'ok',
			payload: result,
		};
	}

	@Delete('logout/kill-session')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthorizationGuard)
	@ApiOkResponse({ type: LogoutHttpReponse })
	@ApiDefaultResponse({ type: HttpDefaultResponse })
	@ApiBearerAuth()
	async logout(@AuthenticatedUser() aUser: AuthUser) {
		// ---

		const result = await this.logoutService.kill(aUser.sessionId, aUser.userId);

		return {
			isError: false,
			message: 'Session successfully killed',
			description: '',
			context: 'ok',
			payload: result,
		};
	}
}
