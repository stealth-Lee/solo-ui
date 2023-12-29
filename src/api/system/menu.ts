import qs from "qs";
import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface MenuReq {
  menuId: number;
  parentId: number;
  type: string;
  name: string;
  icon: string;
  path: string;
  permission: string;
  visible: boolean;
  keepAlive: boolean;
  sort: number;
  remark: string;
}

// 新增菜单
export const creating = (data: MenuReq) => {
  return http.post(baseUrlApi("/system/menu"), { data });
};

// 删除菜单
export const deleting = (menuIds: number) => {
  return http.delete(baseUrlApi("/system/menu/" + menuIds));
};

// 修改菜单
export const updating = (data: MenuReq) => {
  return http.put(baseUrlApi("/system/menu"), { data });
};

// 获取单条菜单信息
export const getting = (menuId: number) => {
  return http.get<MenuReq>(baseUrlApi("/system/menu/" + menuId));
};

// 获取树形菜单精简信息列表
export const listSimple = (type?: string[]) => {
  const params = {
    type: type
  };
  return http.get<MenuReq[]>(
    baseUrlApi("/system/menu/list-simple"),
    { params },
    {
      paramsSerializer: function (params) {
        // 设置数组接受的格式 ?type=1&type=2
        return qs.stringify(params, { indices: false });
      }
    }
  );
};

// 获取菜单信息分页列表
export const listing = (params?: object) => {
  return http.get<MenuReq>(baseUrlApi("/system/menu/list"), { params });
};
