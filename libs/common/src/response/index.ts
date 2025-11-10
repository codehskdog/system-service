export class ResponseError {
  message: string;
  code: number | string;
  // success: boolean;
  constructor(code: number | string, message: string) {
    this.message = message;
    this.code = code;
    // this.success = false;
  }
}

export class ResponseSuccess {
  message: string;
  code: number | string;
  data: any = undefined;
  // success: boolean;
  constructor(
    code: number | string = 200,
    message: string = 'SUCCESS',
    data?: any,
  ) {
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
export const RES = {
  Success: new ResponseSuccess(),
};
