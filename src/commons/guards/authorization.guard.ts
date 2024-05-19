import jwt from 'jsonwebtoken';

import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtAction, JwtSigningPayload } from '../dtos/jwt.dto';
import { AppConfig, JwtConfigs } from '../../configs/configs.type';

@Injectable()
export class AuthorizationGuard implements CanActivate {
	constructor(
		private readonly configService: ConfigService<AppConfig>,
	) // private readonly logger: LoggerService,
	{ }

	private extractTokenFromHeader(request: Request): string | undefined {
		// ---

		const [type, token] = request.headers.authorization?.split(' ') ?? [];

		if (type === 'Bearer') {
			return token;
		}

		return undefined;
	}

	private extractUserIdFromHeader(request: Request): string | undefined {
		// ---

		const userId = request.get('x-uid');

		return userId;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// ---

		const request = context.switchToHttp().getRequest<Request>();

		const accessToken = this.extractTokenFromHeader(request);

		if (!accessToken) {
			throw new ForbiddenException('The required headers are missing');
		}
		const jwtConfigs = this.configService.getOrThrow<JwtConfigs>('jwt');

		const payload = jwt.verify(accessToken, jwtConfigs.secret, {
			algorithms: [jwtConfigs.algorithm],
		}) as JwtSigningPayload;

		if (payload.action !== JwtAction.authorize) {
			throw new BadRequestException('Invalid authorization credentials');
		}

		const userId = this.extractUserIdFromHeader(request);

		if (userId !== payload.uid) {
			throw new BadRequestException('Invalid authorization credentials');
		}

		request['user'] = {
			userId: payload.uid,
			role: payload.r,
			deviceHash: payload.did,
			sessionId: payload.sid,
		};

		return true;
	}
}
