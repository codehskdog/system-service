import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
)
export class ErrorFilter<T> implements ExceptionFilter {
  catch(
    exception:
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientRustPanicError
      | PrismaClientInitializationError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = exception.message;
    let time = Date.now();
    let code;
    let meta;
    let reqDesc =
      `[<${time}>-${request.method}-${request.url}]` +
      JSON.stringify(request.body);
    if (exception instanceof PrismaClientKnownRequestError) {
      code = exception.code;
      meta = exception.meta;
      Logger.error(getPrismaErrorMessage(code, JSON.stringify(meta)), reqDesc);
      message = '数据库操作异常';
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      message = '未知查询错误';
    }
    if (exception instanceof PrismaClientRustPanicError) {
      message = '数据库运行异常';
    }
    if (exception instanceof PrismaClientInitializationError) {
      code = exception.errorCode;
      Logger.error(getPrismaErrorMessage(code, message));
      message = '数据库连接异常';
    }
    if (exception instanceof PrismaClientValidationError) {
      message = '数据结构异常';
    }
    // throw new CustomException(code, message, 400);

    response.status(400).json({
      code: code,
      message: message,
      time,
    });
  }
}
export function getPrismaErrorMessage(code: string, message?: string): string {
  const errorMessages: Record<string, string> = {
    P1000: '数据库身份验证失败',
    P1001: '无法访问数据库服务器',
    P1002: '连接数据库超时',
    P1003: '数据库文件不存在',
    P1004: '数据库架构不存在',
    P1005: '数据库不存在',
    P1008: '操作超时',
    P1009: '数据库已存在',
    P1010: '访问数据库被拒绝',
    P1011: 'TLS 连接错误',
    P1012: 'Prisma 架构验证失败',
    P1013: '无效的数据库连接字符串',
    P1014: '底层数据库对象不存在',
    P1015: '数据库版本不支持当前功能',
    P1016: '原始查询参数数量错误',
    P1017: '服务器已关闭连接',

    // 新增错误码 (P2000-P2037)
    P2000: '字段值长度超出限制',
    P2001: '查询记录不存在',
    P2002: '唯一约束冲突',
    P2003: '外键约束失败',
    P2004: '数据库约束失败',
    P2005: '字段值类型无效',
    P2006: '提供的字段值无效',
    P2007: '数据验证错误',
    P2008: '查询解析失败',
    P2009: '查询验证失败',
    P2010: '原始查询执行失败',
    P2011: '违反非空约束',
    P2012: '缺少必需值',
    P2013: '缺少字段参数',
    P2014: '违反必需关系约束',
    P2015: '相关记录未找到',
    P2016: '查询解释错误',
    P2017: '关系记录未关联',
    P2018: '连接记录未找到',
    P2019: '输入参数错误',
    P2020: '值超出类型范围',
    P2021: '数据库表不存在',
    P2022: '数据库列不存在',
    P2023: '列数据不一致',
    P2024: '连接池获取连接超时',
    P2025: '依赖的记录不存在',
    P2026: '数据库不支持此功能',
    P2027: '数据库发生多个错误',
    P2028: '事务 API 错误',
    P2029: '查询参数超出限制',
    P2030: '缺少全文索引',
    P2031: 'MongoDB 需要副本集运行',
    P2033: '数字超出 64 位整数范围',
    P2034: '事务因冲突失败，请重试',
    P2035: '数据库断言违规',
    P2036: '外部连接器错误',
    P2037: '打开的数据库连接过多',
  };

  const baseMessage = errorMessages[code] || ``;
  let prefix = code ? `[${code}]` : '';
  if (code && code.startsWith('P1')) {
    prefix = prefix + '数据库连接异常: ';
  }
  if (code && code.startsWith('P2')) {
    prefix = prefix + '数据库内部异常: ';
  }
  const _message = message ? `${baseMessage}: ${message}` : baseMessage;
  return prefix + _message;
}
