import { User } from '../user/dtos/user.dto';

export interface ILoginResponse {
	message: string;
	user: User;
	accessToken: string;
	refreshToken: string;
}

export interface IHttpResponse {
	message: string;
}

export interface ISignupResponse {
	message: string;
	user: Omit<User, 'password'>;
}

export interface IJwtPayload {
	sub: string;
	email: string;
	iat: number;
	exp: number;
}

export interface IFilterException {
	statusCode: number;
	timestamp: string;
	path: string;
	message: string;
}

export interface IResetPassword {
	password: string;
}
