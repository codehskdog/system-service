import { Role } from './role';

export class User {
  id: string;

  email?: string;

  name?: string;

  username?: string;

  password?: string;

  salt?: string;

  createdAt: Date;

  updatedAt: Date;

  roles: Role[];
}
