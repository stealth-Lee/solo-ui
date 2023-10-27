import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface RoleReq {
  roleId: number;
  roleName: string;
  roleCode: string;
  dataScope: number;
  status: number;
  remark: string;
}

// 新增角色
export const creating = (data: RoleReq) => {
  return http.post(baseUrlApi("/system/role"), { data });
};

// 删除角色
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/system/role/" + id));
};

// 修改角色状态
export const updateStatus = (roleId: number, status: number) => {
  const data = {
    roleId,
    status
  };
  return http.put(baseUrlApi("/system/role/update-status"), { data });
};

// 修改角色
export const updating = (data: RoleReq) => {
  return http.put(baseUrlApi("/system/role"), { data });
};

// 获取单条角色信息
export const getting = (id: number) => {
  return http.get<RoleReq>(baseUrlApi("/system/role/" + id));
};

// 获取角色信息分页列表
export const paging = (params?: object) => {
  return http.get<RoleReq>(baseUrlApi("/system/role/page"), {
    params
  });
};
