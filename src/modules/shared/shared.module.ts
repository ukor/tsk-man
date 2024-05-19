import { Module } from '@nestjs/common';

import { SharedService } from './shared.service';
import { ConfigService } from '@nestjs/config';

@Module({
	providers: [
		ConfigService,
		// EmailService,
		SharedService,
		// SendChampService,
	],
	exports: [SharedService],
})
export class SharedModule { }
