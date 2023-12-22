import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface UserReq {
  userId: number;
  deptId: number;
  username: string;
  password: string;
  nickname: string;
  name: string;
  sex: number;
  mobile: string;
  email: string;
  status: number;
  remark: string;
}

/**
 * 新增用户
 * @param data 用户信息
 * @returns 返回信息
 */
export const creating = (data: UserReq) => {
  return http.post(baseUrlApi("/system/user"), { data });
};

/**
 * 删除部门
 * @param id 部门id
 * @returns 返回信息
 */
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/system/user/" + id));
};

// 重置密码
export const resetPassword = (userId: number, password: string) => {
  const data = {
    userId,
    password
  };
  return http.put(baseUrlApi("/system/user/reset-password"), { data });
};

/**
 * 修改用户
 * @param id 用户id
 * @returns 返回信息
 */
export const updating = (data: UserReq) => {
  return http.put(baseUrlApi("/system/user"), { data });
};

/**
 * 获取单条用户信息
 * @param id 用户id
 * @returns 用户信息
 */
export const getting = (id: number) => {
  return http.get<UserReq>(baseUrlApi("/system/user/" + id));
};

/**
 * 获取用户信息分页列表
 * @param params 查询条件
 * @returns 部门信息列表
 */
export const paging = (params?: object) => {
  return http.get<UserReq>(baseUrlApi("/system/user/page"), {
    params
  });
};
