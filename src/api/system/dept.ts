import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  data?: Array<any>;
};

/**
 * 新增部门
 * @param data 部门信息
 * @returns 返回信息
 */
export const insert = (data: object) => {
  console.log(data);
  return http.post(baseUrlApi("/system/dept"), { data });
};

/**
 * 删除部门
 * @param id 部门id
 * @returns 返回信息
 */
export const del = (id: number) => {
  return http.request("delete", baseUrlApi("/system/dept/" + id));
};

/** 获取部门管理树形列表 */
export const tree = (params: object) => {
  return http.get<any, Result>(baseUrlApi("/system/dept/tree"), { params });
};
