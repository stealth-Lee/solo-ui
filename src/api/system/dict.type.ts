import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface DictTypeReq {
  dictName: string;
  dictCode: string;
  dictType: string;
  status: string;
  remark: string;
}

// 获取字典类型精简列表
export const listSimple = () => {
  return http.get<DictTypeReq>(baseUrlApi("/system/dict-type/list-simple"));
};
