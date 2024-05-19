import { UserRole } from '../../modules/user/dtos/user-role.dto';

export const JwtAction = {
	authorize: 'authorize',
	verify_otp: 'verify_otp',
} as const;

export type JwtAction = keyof typeof JwtAction;

export type JwtSigningPayload = {
	uid: string;
	sid: string;
	r: UserRole;
	did?: string;
	action: JwtAction;
};

// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export interface JwtPayload {
	[key: string]: any;
	iss?: string;
	sub?: string;
	aud?: string | string[];
	exp?: number;
	nbf?: number;
	iat?: number;
	jti?: string;
}
