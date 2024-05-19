import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { HttpBaseResponse } from '../../../commons/dtos/http-response.dto';
import { UserDeviceDto } from '../../../commons/dtos/user-device.dto';
import { AuthenticationNextStep } from './auth-step.dto';

export class RegisterSetPhoneNumber {
	// ---

	@ApiProperty({
		example: '+2349019133013',
		description: 'The phone number of the User',
		format: 'phone number',
	})
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string;

	@ApiProperty({ type: () => UserDeviceDto })
	@IsOptional()
	deviceDetails: UserDeviceDto;

	constructor(arg: Required<RegisterSetPhoneNumber>) {
		// ---

		Object.assign(this, arg);
	}
}

export class SetPhoneNumberResponse {
	@ApiProperty()
	readonly token: string;

	// @ApiProperty()
	// readonly identity: string;

	@ApiProperty()
	readonly userId: string;

	@ApiProperty({ enum: AuthenticationNextStep })
	readonly next: AuthenticationNextStep;

	constructor(arg: Required<SetPhoneNumberResponse>) {
		Object.assign(this, arg);
	}
}

export class SetPhoneNumberHttpResponse extends HttpBaseResponse {
	@ApiProperty({ type: SetPhoneNumberResponse })
	readonly payload: SetPhoneNumberResponse;

	constructor(arg: Required<SetPhoneNumberHttpResponse>) {
		super(arg);

		Object.assign(this, arg);
	}
}

export class VerifyPhoneNumberOrEmailAddressDto {
	// ---

	@ApiProperty({
		example: 'otp',
		description:
			'A six digit character that was sent to the identity been verified',
	})
	@IsString()
	@IsNotEmpty()
	otp: string;

	@ApiProperty({
		example: '+23408020144002 || example@gmail.com',
		description: 'The phone number or email address been verified',
	})
	@IsString()
	@IsNotEmpty()
	identity: string;

	@ApiProperty({
		description: 'A string representation for identifing user',
	})
	@IsString()
	@IsNotEmpty()
	userId: string;

	@ApiProperty({
		description:
			'An Object mapping user device details to it corresponding details',
	})
	@Type(() => UserDeviceDto)
	@IsOptional()
	deviceDetails: UserDeviceDto;

	constructor(arg: Required<VerifyPhoneNumberOrEmailAddressDto>) {
		// ---

		Object.assign(this, arg);
	}
}

export class OtpVerificationResponse {
	// ---

	@ApiProperty({
		description: 'Json Web Token for validating next step validation ',
	})
	token: string;

	@ApiProperty({
		description: 'User Identifier',
	})
	userId: string;

	// @ApiProperty({
	//   description: 'Identity been verified. In this case user phone number',
	// })
	// identity: string;

	@ApiProperty({
		enum: AuthenticationNextStep,
		description:
			'The next step/screen that should be shown to the user on the client',
	})
	next: AuthenticationNextStep;

	constructor(arg: Required<OtpVerificationResponse>) {
		// ---

		Object.assign(this, arg);
	}
}

export class OtpVerificationHttpResponse extends HttpBaseResponse {
	@ApiProperty({ type: () => OtpVerificationResponse })
	payload: OtpVerificationResponse;

	constructor(arg: Required<OtpVerificationHttpResponse>) {
		super(arg);

		Object.assign(this, arg);
	}
}

export class RegisterSetEmailAndPassword {
	// ---

	@ApiProperty({
		example: 'test@gmail.com',
		description: 'The email of the User',
		format: 'email',
		uniqueItems: true,
		minLength: 5,
		maxLength: 255,
	})
	@IsEmail()
	@IsNotEmpty()
	emailAddr: string;

	@ApiProperty({
		example: 'secret password change me!',
		description: 'The password of the User',
		format: 'string',
		minLength: 6,
		maxLength: 32,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(32)
	password: string;

	@ApiProperty({
		example: 'secret password change me!',
		description: 'The password of the User',
		format: 'string',
		minLength: 6,
		maxLength: 32,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(32)
	confirmPassword: string;

	@ApiProperty({
		description:
			'An Object mapping user device details to it corresponding details',
	})
	@Type(() => UserDeviceDto)
	@IsOptional()
	deviceDetails: UserDeviceDto;

	constructor(arg: Required<RegisterSetEmailAndPassword>) {
		// ---
		Object.assign(this, arg);
	}
}

export class SetEmailAndPasswordResponse extends SetPhoneNumberResponse { }

export class SetEmailAndPasswordHttpResponse extends HttpBaseResponse {
	@ApiProperty({ type: () => SetEmailAndPasswordResponse })
	readonly payload: SetEmailAndPasswordResponse;

	constructor(arg: Required<SetEmailAndPasswordHttpResponse>) {
		super(arg);

		Object.assign(this, arg);
	}
}

export class RegisterSetBioDto {
	// ---

	@ApiProperty({
		example: 'john',
		description: 'First Name for the new user',
	})
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({
		example: 'doe',
		description: 'Last Name for the new user',
	})
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({
		example: 'ken',
		description: 'Middle Name for the new user',
	})
	@IsString()
	@IsOptional()
	middleName?: string;

	@ApiProperty({
		example: '12,10,1992',
		description:
			"Date of Birth(dob) for the new user- It should take this format, Day,Month,Year - dd,MM,yyyy'. With that been said, May 1st 2024 will transalate to 01,05,2024",
	})
	@IsString()
	@IsNotEmpty()
	dob: string;

	constructor(arg: Required<RegisterSetBioDto>) {
		// ---

		Object.assign(this, arg);
	}
}

export class BioDataDto {
	// ---

	@IsString()
	lastName: string;

	@IsString()
	firstName: string;

	@IsOptional()
	middleName?: string;

	@Type(() => Date)
	dob: Date;

	constructor(arg: Required<BioDataDto>) {
		// ---

		Object.assign(this, arg);
	}
}

class BioResponse extends RegisterSetBioDto {
	@ApiProperty()
	readonly userId: string;
}

export class SetBioResponse {
	@ApiProperty({ type: () => BioResponse })
	bio: BioResponse;

	@ApiProperty({ enum: AuthenticationNextStep })
	next: AuthenticationNextStep;
}

export class SetBioHttpResponse extends HttpBaseResponse {
	// ---

	@ApiProperty({ type: () => SetBioResponse })
	payload: SetBioResponse;

	constructor(arg: Required<SetBioHttpResponse>) {
		super(arg);

		Object.assign(this, arg);
	}
}
