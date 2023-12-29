import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface OnlineUserReq {
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

// 踢出用户下线
export const offline = (userIds?: number) => {
  return http.delete<OnlineUserReq>(
    baseUrlApi("/system/online-user/offline/" + userIds)
  );
};

// 查询在线用户
export const paging = (params?: object) => {
  return http.get<OnlineUserReq>(baseUrlApi("/system/online-user/page"), {
    params
  });
};
