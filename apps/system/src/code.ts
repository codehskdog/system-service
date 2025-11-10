export enum Status {
  USER_SERVICE_ERROR = 500001,
}

export const STATUS_MESSAGE = {
  [Status.USER_SERVICE_ERROR]: '用户服务异常',
};
