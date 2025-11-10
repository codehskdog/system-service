import { Role } from './role';

export class Permission {
  id: string;

  parentId?: string;

  parent?: Permission;

  children: Permission[];

  name: string;

  description: string;

  type: number;

  isSystem: boolean;

  createdAt: Date;

  updatedAt: Date;

  roles: Role[];
}
