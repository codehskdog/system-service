import { BusinessError } from '@app/common';
import { STATUS_MESSAGE } from '../code';
import * as crypto from 'crypto';

export class UserBusinessError extends BusinessError {
  constructor(code: number | string, message?: string) {
    super(STATUS_MESSAGE, code, message);
  }
}

/**
 * 生成密码的盐值和哈希结果
 * @param {string} password 原始密码
 * @returns {object} { salt: 盐值(hex), hash: 哈希结果(hex) }
 */
export function hashPassword(password) {
  console.log(crypto);
  // 1. 生成 16 字节（128位）的随机盐值
  const salt = crypto.randomBytes(16).toString('hex');

  // 2. 使用 PBKDF2 哈希：参数依次为密码、盐值、迭代次数、哈希长度、哈希算法
  const iterations = 100000; // 迭代次数（越高越安全，但性能消耗越大）
  const keylen = 64; // 哈希结果长度（字节）
  const digest = 'sha512'; // 哈希算法
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString('hex');

  return { salt, hash };
}

/**
 * 验证密码是否匹配
 * @param {string} password 待验证的原始密码
 * @param {string} salt 存储的盐值
 * @param {string} storedHash 存储的哈希结果
 * @returns {boolean} 是否匹配
 */
export function verifyPassword(password, salt, storedHash) {
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';
  // 用相同盐值和参数计算哈希
  const computedHash = crypto
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString('hex');
  // 对比计算结果与存储的哈希
  return computedHash === storedHash;
}
