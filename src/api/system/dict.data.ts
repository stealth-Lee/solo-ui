import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface DictDataReq {
  dataId: number;
  code: string;
  value: string;
  label: string;
  tagType: number;
  tagClass: string;
  dictSort: number;
  status: boolean;
  remark: string;
}

// 新增字典数据
export const creating = (data: DictDataReq) => {
  return http.post(baseUrlApi("/system/dict-data"), { data });
};

// 删除字典数据
export const deleting = (dataIds: number) => {
  return http.delete(baseUrlApi("/system/dict-data/" + dataIds));
};

// 字典数据状态切换
export const updateStatus = (dataId: number, status: boolean) => {
  const data = {
    dataId,
    status
  };
  return http.put(baseUrlApi("/system/dict-data/update-status"), { data });
};

// 修改字典数据
export const updating = (data: DictDataReq) => {
  return http.put(baseUrlApi("/system/dict-data"), { data });
};

// 根据字典编码获取字典数据列表
export const selectByCode = (code: String) => {
  return http.get(baseUrlApi("/system/dict-data/code/" + code));
};

// 获取单条字典数据信息
export const getting = (dataId: number) => {
  return http.get<DictDataReq>(baseUrlApi("/system/dict-data/" + dataId));
};

// 获取字典数据信息分页列表
export const paging = (params?: object) => {
  return http.get<DictDataReq>(baseUrlApi("/system/dict-data/page"), {
    params
  });
};
