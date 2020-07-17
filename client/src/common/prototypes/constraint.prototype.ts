export type MutexConstraintPrototype = {
  type: 'mutex';
  mutexReqIds: string[];
};

export type ConstraintPrototype = MutexConstraintPrototype;

let a: ConstraintPrototype;
