import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  data?: Object;
};

export interface RoleReq {
  roleId: number;
  roleName: string;
  roleCode: string;
  dataScope: number;
  status: number;
  remark: string;
}

/**
 * 新增角色
 * @param data 角色信息
 * @returns 返回信息
 */
export const creating = (data: RoleReq) => {
  return http.post(baseUrlApi("/system/role"), { data });
};

/**
 * 删除角色
 * @param id 角色id
 * @returns 返回信息
 */
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/system/role/" + id));
};

/**
 * 修改角色
 * @param id 角色id
 * @returns 返回信息
 */
export const updating = (data: RoleReq) => {
  return http.put(baseUrlApi("/system/role"), { data });
};

/**
 * 获取单条角色信息
 * @param id 角色id
 * @returns 角色信息
 */
export const getting = (id: number) => {
  return http.get<object, Result>(baseUrlApi("/system/role/" + id));
};

/**
 * 获取角色信息分页列表
 * @param params 查询条件
 * @returns 角色信息列表
 */
export const paging = (params?: object) => {
  return http.get<object, Result>(baseUrlApi("/system/role/page"), {
    params
  });
};
