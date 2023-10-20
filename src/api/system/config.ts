import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

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

// 获取系统配置信息分页列表
export const paging = (params?: object) => {
  return http.get(baseUrlApi("/system/config/page"), {
    params
  });
};
