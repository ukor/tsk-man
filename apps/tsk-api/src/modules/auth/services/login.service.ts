import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import * as argon2 from 'argon2';

import { LoginRequest, LoginResponse } from '../dto/login.dto';
import {
	OtpVerificationResponse,
	VerifyPhoneNumberOrEmailAddressDto,
} from '../dto/sign-up.dto';
import { LoginRepository } from '../repositories/login.repository';
import { JwtAction } from '../../../commons/dtos/jwt.dto';
import { AuthenticationNextStep } from '../dto/auth-step.dto';
import { SharedService } from '../../shared/shared.service';
import { UserRole } from '../../user/dtos/user-role.dto';

@Injectable()
export class LoginService {
	// ---

	constructor(
		private readonly loginRepository: LoginRepository,
		private readonly sharedService: SharedService,
	) { }

	private async sendOtpViaEmail(email: string, otp: string, name: string = '') {
		// ---

		console.log({ email, otp, name });
	}

	async loginRequest(credentials: LoginRequest): Promise<LoginResponse> {
		// ---

		const user = await this.loginRepository.getUserCredentialsWithEmail(
			credentials.email,
		);

		const isPassword = await argon2.verify(user.password, credentials.password);

		if (!isPassword) {
			throw new UnauthorizedException(
				'Invalid login credentials. Check that you are entering the right details',
			);
		}

		// TODO - Hash device details with the email address, to gauranty more entropy
		const deviceHash = 'some-random-string-123456';

		// TODO - check user settings, if 2fa is enabled

		// TODO - generate OTP - using device hash to gauranty unique OTP
		const otp = '123456';

		this.sendOtpViaEmail(credentials.email, otp, user.firstName);

		// console.log({ otp, ops: 'login-service' });

		const accessToken = await this.sharedService.generateJWT(
			user._id.toString(),
			deviceHash,
			JwtAction.verify_otp,
			user.userRole,
			'',
		);

		return {
			token: accessToken,
			userId: user._id.toString(),
			next: AuthenticationNextStep.t2fa,
		};
	}

	async twoFaVerification(
		arg: VerifyPhoneNumberOrEmailAddressDto,
	): Promise<OtpVerificationResponse> {
		// ---

		const deviceHash = this.sharedService.hashDeviceDetails(
			arg.deviceDetails,
			arg.identity,
		);

		// TODO - you know this is wrong - do a more comprehensive otp verification
		// Again, use the device hash

		const otps = ['123456', '000000', '111111'];
		if (!otps.includes(arg.otp)) {
			throw new BadRequestException(
				'Invalide OTP. Otp must have expired or wrongly entered.',
			);
		}

		const sessionId = await this.loginRepository.logRequest(
			arg.userId,
			arg.deviceDetails,
			deviceHash,
			'email',
		);

		const accessToken = await this.sharedService.generateJWT(
			arg.userId,
			deviceHash,
			JwtAction.authorize,
			UserRole.User,
			sessionId,
		);

		return {
			token: accessToken,
			userId: arg.userId,
			next: AuthenticationNextStep.dashboard,
		};
	}
}
