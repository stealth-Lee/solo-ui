import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface RoleMenuReq {
  roleId: number;
  menuId: number;
}

// 分配菜单权限
export const assignMenu = (data: object) => {
  return http.put<[]>(baseUrlApi("/system/role-menu/assign"), { data });
};

// 根据角色iD查询所属菜单ID集合
export const queryMenuIds = (roleId: number) => {
  return http.get<[]>(baseUrlApi("/system/role-menu/" + roleId));
};
