import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface OperateLogReq {
  operateId: number;
  title: string;
  type: number;
  method: string;
  requestUrl: string;
  requestMethod: number;
  requestData: string;
  responseData: string;
  exceptionInfo: string;
  userIp: string;
  userAgent: string;
  deviceName: string;
  browserName: string;
  executionTime: number;
  remark: string;
}

// 删除操作日志
export const deleting = (operateIds: number) => {
  return http.delete(baseUrlApi("/system/operate-log/" + operateIds));
};

// 获取单条操作日志信息
export const getting = (operateId: number) => {
  return http.get<OperateLogReq>(
    baseUrlApi("/system/operate-log/" + operateId)
  );
};

// 获取操作日志信息列表
export const paging = (params?: object) => {
  return http.get<OperateLogReq>(baseUrlApi("/system/operate-log/page"), {
    params
  });
};
