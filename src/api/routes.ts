import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.get<Result>(baseUrlApi("/system/menu"));
  // return http.request<Result>("get", "/getAsyncRoutes");
};
