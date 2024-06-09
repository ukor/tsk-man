import { Db, MongoClient } from 'mongodb';

export interface ImConnection {
	mClient: MongoClient;
	mDbInstance: Db;
}

export class MConnection implements ImConnection {
	readonly mClient: MongoClient;

	readonly mDbInstance: Db;

	constructor(m: Required<unknown>) {
		// ---

		Object.assign(this, m);
	}
}
