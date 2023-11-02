import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface DictTypeReq {
  typeId: number;
  name: string;
  code: string;
  type: number;
  status: boolean;
  remark: string;
}

// 新增字典类型
export const creating = (data: DictTypeReq) => {
  return http.post(baseUrlApi("/system/dict-type"), { data });
};

// 删除字典类型
export const deleting = (typeIds: number) => {
  return http.delete(baseUrlApi("/system/dict-type/" + typeIds));
};

// 修改字典类型状态
export const updateStatus = (typeId: number, status: boolean) => {
  const data = {
    typeId,
    status
  };
  return http.put(baseUrlApi("/system/dict-type/update-status"), { data });
};

// 修改字典类型
export const updating = (data: DictTypeReq) => {
  return http.put(baseUrlApi("/system/dict-type"), { data });
};

// 获取单条字典类型信息
export const getting = (typeId: number) => {
  return http.get<DictTypeReq>(baseUrlApi("/system/dict-type/" + typeId));
};

// 获取字典类型精简列表
export const listSimple = () => {
  return http.get<Array<DictTypeReq>>(
    baseUrlApi("/system/dict-type/list-simple")
  );
};

// 获取字典类型信息分页列表
export const paging = (params?: object) => {
  return http.get<DictTypeReq>(baseUrlApi("/system/dict-type/page"), {
    params
  });
};
