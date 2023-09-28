import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  data?: Array<any>;
};

export interface DeptReq {
  deptId: number;
  parentId: number;
  deptName: string;
  deptCode: string;
  deptSort: number;
  remark: string;
}

/**
 * 新增部门
 * @param data 部门信息
 * @returns 返回信息
 */
export const creating = (data: DeptReq) => {
  return http.post(baseUrlApi("/system/dept"), { data });
};

/**
 * 删除部门
 * @param id 部门id
 * @returns 返回信息
 */
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/system/dept/" + id));
};

/**
 * 修改部门
 * @param id 部门id
 * @returns 返回信息
 */
export const updating = (data: DeptReq) => {
  return http.put(baseUrlApi("/system/dept"), { data });
};

/**
 * 获取单条部门信息
 * @param id 部门id
 * @returns 部门信息
 */
export const getting = (id: number) => {
  return http.get<object, Result>(baseUrlApi("/system/dept/" + id));
};

/**
 * 获取树形部门精简信息列表
 * @returns 部门精简信息列表
 */
export const listSimple = () => {
  return http.get<object, Result>(baseUrlApi("/system/dept/list-simple"));
};

/**
 * 获取树形部门信息列表
 * @param params 查询条件
 * @returns 部门信息列表
 */
export const listing = (params?: object) => {
  return http.get<object, Result>(baseUrlApi("/system/dept/list"), { params });
};
