import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  data?: Array<any>;
};

export interface DictDataReq {
  dataId: number;
  deptCode: string;
  dictValue: string;
  dictLabel: string;
  dictSort: number;
  status: number;
  remark: string;
}

/**
 * 新增部门
 * @param data 部门信息
 * @returns 返回信息
 */
export const creating = (data: DictDataReq) => {
  return http.post(baseUrlApi("/system/dict-data"), { data });
};

/**
 * 删除部门
 * @param id 部门id
 * @returns 返回信息
 */
export const deleting = (id: number) => {
  return http.delete(baseUrlApi("/system/dict-data/" + id));
};

/**
 * 修改部门
 * @param id 部门id
 * @returns 返回信息
 */
export const updating = (data: DictDataReq) => {
  return http.put(baseUrlApi("/system/dict-data"), { data });
};

/**
 * 获取单条部门信息
 * @param id 部门id
 * @returns 部门信息
 */
export const getting = (id: number) => {
  return http.get<object, Result>(baseUrlApi("/system/dict-data/" + id));
};

/**
 * 根据字典编码获取字典数据列表
 * @param dictCode 字典编码
 * @returns 字典数据列表
 */
export const selectByDictCode = (dictCode: String) => {
  return http.get<object, Result>(
    baseUrlApi("/system/dict-data/code/" + dictCode)
  );
};
