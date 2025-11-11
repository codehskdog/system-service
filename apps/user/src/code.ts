export enum Status {
  HAD_CREATED_USER = 400001,
  USER_NOT_FOUND = 400002,
  USER_PASSWORD_ERROR = 400003,
}

export const STATUS_MESSAGE = {
  [Status.HAD_CREATED_USER]: '用户已存在',
  [Status.USER_NOT_FOUND]: '用户不存在',
  [Status.USER_PASSWORD_ERROR]: '密码错误',
};
