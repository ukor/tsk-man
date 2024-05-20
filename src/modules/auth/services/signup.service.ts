import * as argon2 from 'argon2';

import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common';
import { SharedService } from '../../shared/shared.service';
import { JwtAction } from '../../../commons/dtos/jwt.dto';
import {
	OtpVerificationResponse,
	RegisterSetEmailAndPassword,
	SetEmailAndPasswordResponse,
	VerifyPhoneNumberOrEmailAddressDto,
} from '../dto/sign-up.dto';
import { SignupRepository } from '../repositories/signup.repositry';
import { AuthenticationNextStep } from '../dto/auth-step.dto';
import { UserRole } from '../../user/dtos/user-role.dto';
import { UserStatus } from '../../user/dtos/user.dto';

@Injectable()
export class SignUpService {
	// ---

	constructor(
		private readonly sharedService: SharedService,
		private readonly signupRepository: SignupRepository,
	) { }

	private async sendOtpViaEmail(email: string, otp: string, name: string = '') {
		// ---

		console.log({ ops: 'send otp via email', otp, email, name });
	}

	async setEmailAndPassword(
		arg: RegisterSetEmailAndPassword,
	): Promise<SetEmailAndPasswordResponse> {
		// ---
		//

		if (arg.password !== arg.confirmPassword) {
			throw new ConflictException('Password does not match.');
		}

		const hashedPassword = await argon2.hash(arg.password);

		const user = await this.signupRepository.getUserWithEmailAddress(
			arg.emailAddr,
		);

		if (user !== null) {
			throw new ConflictException('Email address already in use.');
		}

		const deviceHash = this.sharedService.hashDeviceDetails(
			arg.deviceDetails,
			arg.emailAddr,
		);

		const userId = await this.signupRepository.setEmailAndPassword(
			arg.emailAddr,
			hashedPassword,
			arg.firstName,
			arg.lastName,
		);

		// const otp = this.otpService.generate(deviceHash);
		const otp = '123456';

		await this.sendOtpViaEmail(arg.emailAddr, otp, arg.firstName);

		const token = await this.sharedService.generateJWT(
			userId.toString(),
			deviceHash,
			JwtAction.verify_otp,
			UserRole.User,
			'',
		);

		return {
			token,
			// identity: arg.emailAddr,
			userId: userId.toString(),
			next: AuthenticationNextStep.email_verification,
		};
	}

	async verifyEmailAddress(
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

		const result = await this.signupRepository.setEmailVerificationState(
			arg.identity,
			arg.userId,
			arg.deviceDetails,
			deviceHash,
		);

		const token = await this.sharedService.generateJWT(
			arg.userId,
			deviceHash,
			JwtAction.authorize,
			UserRole.User,
			result.sessionId,
		);

		return {
			token,
			userId: arg.userId,
			next: AuthenticationNextStep.dashboard,
		};
	}
}
