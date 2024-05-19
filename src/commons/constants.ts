export const MONGODB_PROVIDER = Symbol();

export const CollectionNames = {
	OperationsLog: 'uperationsLog',
	tasks: 'tasks',
	Users: 'users',
	Sessions: 'sessions',
};

export type CollectionNames = typeof CollectionNames;
