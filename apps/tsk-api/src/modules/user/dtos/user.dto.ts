import { ObjectId } from 'mongodb';

export const UserStatus = {
	active: 'active',
	suspended: 'suspended',
	deleted: 'deleted',
	added_email: 'added_email',
	verified_email: 'verified_email',
} as const;

export type UserStatus = keyof typeof UserStatus;

interface UserBase {
	firstName: string;
	lastName: string;
	email: Email;
	phone: Phone;
	status: UserStatus;
	profileImage: string | null;
	userRole: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserEntity extends UserBase {
	_id: ObjectId;
	password: string;
	// passcode: string;
}

export interface UserEntityWithoutSensitiveData extends UserBase {
	_id: ObjectId;
}

export interface UserCredentials {
	_id: ObjectId;
	email: Email;
	phone: Phone;
	firstName: string;
	password: string;
	status: UserStatus;
	userRole: UserRole;
}

export interface User extends UserBase {
	userId: string;
}

export interface UserWithSensitiveData extends User {
	password: string;
}

export interface iCreateUser extends UserBase {
	password: string;
}

export interface Email {
	isVerified: boolean;
	address: string;
}

export interface Phone {
	isVerified: boolean;
	number: string;
}

export interface UserLocation {
	address: string;
	city: string;
	state: string;
	country: string;
	timeZone: string;
}

export enum UserRole {
	Admin = 'ADMIN',
	User = 'USER',
}
