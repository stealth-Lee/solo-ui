import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface ConfigReq {
  configId: number;
  name: string;
  key: string;
  value: string;
  isSys: boolean;
}

// 新增系统配置
export const creating = (data: object) => {
  return http.post(baseUrlApi("/system/config"), { data });
};

// 删除系统配置
export const deleting = (configIds: number) => {
  return http.delete(baseUrlApi("/system/config/" + configIds));
};

// 修改系统配置
export const updating = (data: object) => {
  return http.put(baseUrlApi("/system/config"), { data });
};

// 获取单条系统配置信息
export const getting = (configId: number) => {
  return http.get(baseUrlApi("/system/config/" + configId));
};

// 根据配置key获取单条系统配置信息
export const getConfig = (key: string) => {
  return http.get<ConfigReq>(baseUrlApi("/system/config/key/" + key));
};

// 获取系统配置信息分页列表
export const paging = (params?: object) => {
  return http.get(baseUrlApi("/system/config/page"), {
    params
  });
};

// 导出系统配置信息
export const exportExcel = (params?: object) => {
  return http.get(baseUrlApi("/system/config/export"), {
    params
  });
};
