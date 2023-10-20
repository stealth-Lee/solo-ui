import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  data?: Object;
};

export interface DatasourceReq {
  sourceId: number;
  name: string;
  url: string;
  username: string;
  password: string;
  remark: string;
}

/**
 * 新增数据源
 * @param data 数据源信息
 * @returns 返回信息
 */
export const creating = (data: DatasourceReq) => {
  return http.post(baseUrlApi("/codegen/datasource"), { data });
};

/**
 * 删除数据源
 * @param id 数据源id
 * @returns 返回信息
 */
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/codegen/datasource/" + id));
};

/**
 * 修改数据源
 * @param id 数据源id
 * @returns 返回信息
 */
export const updating = (data: DatasourceReq) => {
  return http.put(baseUrlApi("/codegen/datasource"), { data });
};

/**
 * 获取单条数据源信息
 * @param id 数据源id
 * @returns 数据源信息
 */
export const getting = (id: number) => {
  return http.get<object, Result>(baseUrlApi("/codegen/datasource/" + id));
};

/**
 * 获取数据源精简信息列表
 * @returns 数据源精简信息列表
 */
export const listSimple = () => {
  return http.get<object, Result>(
    baseUrlApi("/codegen/datasource/list-simple")
  );
};

/**
 * 获取业务表信息分页列表
 * @param params 查询条件
 * @returns 业务表信息列表
 */
export const paging = (params?: object) => {
  return http.get<object, Result>(baseUrlApi("/codegen/datasource/page"), {
    params
  });
};

/**
 * 测试数据源连接是否有效
 * @param id 数据源id
 * @returns 数据源信息
 */
export const test = (id: number) => {
  return http.get<object, Result>(baseUrlApi("/codegen/datasource/test/" + id));
};
