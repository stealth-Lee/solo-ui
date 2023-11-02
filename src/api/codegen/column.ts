import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface ColumnReq {
  columnId: number;
  tableId: number;
  name: string;
  type: string;
  sort: number;
  javaType: string;
  javaField: string;
  javaComment: string;
  isPk: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  iRequired: boolean;
  isList: boolean;
  isQuery: boolean;
  queryMode: string;
  formType: string;
  dictCode: string;
  remark: string;
}

export const listing = (tableId: number) => {
  return http.get<Array<ColumnReq>>(baseUrlApi("/codegen/column/" + tableId));
};
