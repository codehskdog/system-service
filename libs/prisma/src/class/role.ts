import { User } from './user';
import { Permission } from './permission';

export class Role {
  id: string;

  name: string;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  users: User[];

  permissions: Permission[];
}
