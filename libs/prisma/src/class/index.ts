import { User as _User } from './user';
import { Role as _Role } from './role';
import { Permission as _Permission } from './permission';

export namespace PrismaModel {
  export class User extends _User {}
  export class Role extends _Role {}
  export class Permission extends _Permission {}

  export const extraModels = [User, Role, Permission];
}
