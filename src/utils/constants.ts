/**
 * 常用枚举类
 */

// 全局通用状态枚举
export const GlobalStatus = {
  DISABLE: 0, // 禁用
  ENABLE: 1 // 开启
};

// 全局通用错误码
export const GlobalErrorCode = {
  SUCCESS: 0,
  FAILED: 1,

  // 客户端错误
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIME_OUT: 406,

  // 服务端错误
  ERROR: 500
};
