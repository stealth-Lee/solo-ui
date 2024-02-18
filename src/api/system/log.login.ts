import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface LoginLogReq {
  loginId: number;
  username: string;
  ip: string;
  location: string;
  userAgent: string;
  deviceName: string;
  browserName: string;
  status: string;
  loginTime: Date;
  remark: string;
}

// 删除操作日志
export const deleting = (loginIds: number) => {
  return http.delete(baseUrlApi("/system/log-login/" + loginIds));
};

// 获取单条操作日志信息
export const getting = (loginId: number) => {
  return http.get<LoginLogReq>(baseUrlApi("/system/log-login/" + loginId));
};

// 获取操作日志信息列表
export const paging = (params?: object) => {
  return http.get<LoginLogReq>(baseUrlApi("/system/log-login/page"), {
    params
  });
};
