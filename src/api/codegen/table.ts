import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 新增业务表
export const creating = (data: object) => {
  return http.post(baseUrlApi("/codegen/table"), { data });
};

// 删除业务表
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/codegen/table/" + id));
};

// 修改业务表
export const updating = (data: object) => {
  return http.put(baseUrlApi("/codegen/table"), { data });
};

// 获取业务表详细信息
export const getting = (tableId: number) => {
  return http.get(baseUrlApi("/codegen/table/" + tableId));
};

// 预览代码
export const preview = (id: number) => {
  return http.get<object, Result>(baseUrlApi("/codegen/table/preview/" + id));
};

// 获取业务表精简信息列表
export const listSimple = (id: number) => {
  return http.get<object, Result>(
    baseUrlApi("/codegen/table/list-simple/" + id)
  );
};

// 获取业务表信息分页列表
export const paging = (params?: object) => {
  return http.get<object, Result>(baseUrlApi("/codegen/table/page"), {
    params
  });
};
