import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDeviceDto {
	@ApiProperty({
		example: 'mobile',
		required: false,
		description: 'Type of the device (e.g., mobile, desktop)',
	})
	@IsOptional()
	type?: string;

	@ApiProperty({
		example: 'user Ip',
		required: false,
		description: 'user Ip address',
	})
	@IsOptional()
	@IsString()
	ip?: string;

	@ApiProperty({
		example: 'iPhone 12',
		required: false,
		description: 'Model of the device',
	})
	@IsOptional()
	model?: string;

	@ApiProperty({
		example: 'iOS',
		required: false,
		description: 'Operating system of the device',
	})
	@IsOptional()
	os?: string;

	@ApiProperty({
		example: '12',
		required: false,
		description: 'Operating system version of the device',
	})
	@IsOptional()
	osVersion?: string;

	@ApiProperty({
		example: '123456789',
		required: false,
		description: 'Serial number of the device',
	})
	@IsOptional()
	serialNumber?: string;

	@ApiProperty({
		example: 'Apple',
		required: false,
		description: 'Manufacturer of the device',
	})
	@IsOptional()
	manufacturer?: string;

	@ApiProperty({
		example: false,
		required: false,
	})
	@IsOptional()
	isPhysicalDevice?: boolean;

	@ApiProperty({
		example: 'com.tsk-man.user',
		required: false,
	})
	@IsOptional()
	packageName?: string;

	@ApiProperty({
		example: 'v1.0.2',
		required: false,
	})
	@IsOptional()
	appVersion?: string;
}
