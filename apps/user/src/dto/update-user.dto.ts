import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoByUserName } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDtoByUserName) {}
