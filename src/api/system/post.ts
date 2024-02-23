import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface PostReq {
  postId: number;
  name: string;
  code: string;
  sort: number;
  remark: string;
}

// 新增岗位
export const creating = (data: PostReq) => {
  return http.post(baseUrlApi("/system/post"), { data });
};

// 删除岗位
export const deleting = (postIds: number) => {
  return http.delete(baseUrlApi("/system/post/" + postIds));
};

// 修改岗位
export const updating = (data: PostReq) => {
  return http.put(baseUrlApi("/system/post"), { data });
};

// 获取单条岗位信息
export const getting = (postId: number) => {
  return http.get<PostReq>(baseUrlApi("/system/post/" + postId));
};

// 获取精简岗位信息列表
export const listSimple = () => {
  return http.get<PostReq>(baseUrlApi("/system/post/list-simple"));
};

// 获取岗位信息分页列表
export const paging = (params?: object) => {
  return http.get<PostReq>(baseUrlApi("/system/post/page"), { params });
};
