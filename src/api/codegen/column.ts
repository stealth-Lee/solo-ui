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

export const listing = (tableId: number) => {
  return http.get<object, Result>(baseUrlApi("/codegen/column/" + tableId));
};
