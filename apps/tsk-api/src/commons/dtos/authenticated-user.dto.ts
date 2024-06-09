import { UserRole } from '../../modules/user/dtos/user-role.dto';

export class AuthUser {
	// ---

	readonly userId: string;

	readonly role: UserRole;

	readonly sessionId: string;

	readonly deviceHash: string;
}
