import crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import jwt from 'jsonwebtoken';

import { ConfigService } from '@nestjs/config';
import { JwtAction, JwtSigningPayload } from '../../commons/dtos/jwt.dto';
import { UserRole } from '../user/dtos/user-role.dto';
import { JwtConfigs } from '../../configs/configs.type';

@Injectable()
export class SharedService {
	// ---

	constructor(private readonly configService: ConfigService) { }

	addTimestamps(doc: any, isNew: boolean = true): any {
		const now = new Date();
		if (isNew) {
			return { ...doc, createdAt: now, updatedAt: now };
		} else {
			return { ...doc, updatedAt: now };
		}
	}

	hashDeviceDetails(device: Record<string, any>, emailOrPhone: string): string {
		// ---

		const payload = JSON.stringify({ ...device, identity: emailOrPhone });

		const shasum = crypto.createHash('sha256');

		shasum.update(payload);

		return shasum.digest('hex');
	}

	async generateJWT(
		userId: string,
		deviceId?: string,
		action: JwtAction = JwtAction.verify_otp,
		role: UserRole = UserRole.User,
		sessionId: string = '',
	): Promise<string> {
		const expirationTime = action === JwtAction.authorize ? `12h` : '10m';

		const payload: JwtSigningPayload = {
			uid: userId,
			sid: sessionId,
			r: role,
			did: deviceId,
			action,
		};

		const jwtConfigs = this.configService.getOrThrow<JwtConfigs>('jwt');

		const token = jwt.sign(payload, jwtConfigs.secret, {
			algorithm: jwtConfigs.algorithm,
			expiresIn: expirationTime,
		});

		return token;
	}
}
