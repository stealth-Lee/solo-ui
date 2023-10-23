import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export const listing = (tableId: number) => {
  return http.get(baseUrlApi("/codegen/column/" + tableId));
};
