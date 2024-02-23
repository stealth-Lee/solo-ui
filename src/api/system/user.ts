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
  avatar: string;
  status: number;
  remark: string;
  postList: any[];
}

export interface ChangePasswordReq {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 新增用户
export const creating = (data: UserReq) => {
  return http.post(baseUrlApi("/system/user"), { data });
};

// 删除用户
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

// 修改密码
export const changePassword = (data: ChangePasswordReq) => {
  return http.put(baseUrlApi("/system/user/change-password"), { data });
};

// 修改用户
export const updating = (data: UserReq) => {
  return http.put(baseUrlApi("/system/user"), { data });
};

// 修改个人信息
export const updatePersonalInfo = (data: UserReq) => {
  return http.put(baseUrlApi("/system/user/personal-info"), { data });
};

// 获取单条用户信息
export const getting = (id: number) => {
  return http.get<UserReq>(baseUrlApi("/system/user/" + id));
};

// 获取当前登录用户信息
export const currentUser = () => {
  return http.get<UserReq>(baseUrlApi("/system/user/current"));
};

// 获取用户信息分页列表
export const paging = (params?: object) => {
  return http.get<UserReq>(baseUrlApi("/system/user/page"), {
    params
  });
};
