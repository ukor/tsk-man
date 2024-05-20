import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from '../../user/dtos/user-role.dto';

export class AuthLoginDto {
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
	email: string;

	@ApiProperty({
		example: 'secret password change me!',
		description: 'The password of the User',
		format: 'string',
		minLength: 6,
		maxLength: 1024,
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class AuthRegisterDto {
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
	email: string;

	@ApiProperty({
		example: 'secret password change me!',
		description: 'The password of the User',
		format: 'string',
		minLength: 6,
		maxLength: 1024,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(1024)
	password: string;

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
	@IsNotEmpty()
	middleName: string;

	@ApiProperty({
		example: 'j_doe',
		description: 'Tag name for the new user',
	})
	@IsString()
	@IsNotEmpty()
	userTag: string;

	@ApiProperty({
		example: '12th Oct, 1989',
		description: 'Date of Birth(dob) for the new user',
	})
	@Type(() => Date)
	@IsDate()
	dob: string;

	@ApiProperty({
		example: '+2349019000003',
		description: 'The phone number of the User',
		format: 'phone number',
	})
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string;

	@ApiProperty({
		example: 1234,
		description: 'Pin number for the new user account',
	})
	@IsString()
	@IsNotEmpty()
	passCode: number;

	@ApiProperty({
		enum: UserRole,
		required: false,
		description: 'Role of the user in the app',
	})
	@IsEnum(UserRole)
	@IsOptional()
	userRole?: UserRole = UserRole.User;
}
