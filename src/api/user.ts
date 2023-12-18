import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export type UserResult = {
  code: number;
  message: string;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  code: number;
  message: string;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

// 登录
export const getLogin = (data?: object) => {
  return http.post<UserResult>(baseUrlApi("/auth/login"), { data });
};

// 退出登录
export const authLogout = () => {
  return http.delete<UserResult>(baseUrlApi("/auth/logout"));
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.post<RefreshTokenResult>(baseUrlApi("/auth/refreshToken"), {
    data
  });
};
