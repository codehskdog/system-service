import { PrismaModel } from '@app/prisma';
import { Role } from '@prisma/client';

// export class CreateRoleDto implements Partial<Role> {
//   name: string;
//   description: string;
//   permissions: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   id: string;
// }

export class CreateRoleDto extends PrismaModel.Role {}
