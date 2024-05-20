import { Injectable } from '@nestjs/common';
import { LogoutRepository } from '../repositories/logout.repository';

@Injectable()
export class LogoutService {
	constructor(private readonly logoutRepository: LogoutRepository) { }

	async kill(sessionId: string, userId: string) {
		// ---

		const result = await this.logoutRepository.killSession(userId, sessionId);

		return result;
	}

	// TODO - logout from other devices
	//
}
