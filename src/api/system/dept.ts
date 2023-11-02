import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface DeptReq {
  deptId: number;
  parentId: number;
  name: string;
  code: string;
  sort: number;
  remark: string;
}

// 新增部门
export const creating = (data: DeptReq) => {
  return http.post(baseUrlApi("/system/dept"), { data });
};

// 删除部门
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/system/dept/" + id));
};

// 修改部门
export const updating = (data: DeptReq) => {
  return http.put(baseUrlApi("/system/dept"), { data });
};

// 获取单条部门信息
export const getting = (id: number) => {
  return http.get<DeptReq>(baseUrlApi("/system/dept/" + id));
};

// 获取树形部门精简信息列表
export const listSimple = () => {
  return http.get<DeptReq[]>(baseUrlApi("/system/dept/list-simple"));
};

// 获取树形部门信息列表
export const listing = (params?: object) => {
  return http.get<DeptReq[]>(baseUrlApi("/system/dept/list"), { params });
};
