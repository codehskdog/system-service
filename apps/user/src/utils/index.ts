import { BusinessError } from '@app/common';
import { STATUS_MESSAGE } from '../code';

export class UserBusinessError extends BusinessError {
  constructor(code: number | string, message?: string) {
    super(STATUS_MESSAGE, code, message);
  }
}
