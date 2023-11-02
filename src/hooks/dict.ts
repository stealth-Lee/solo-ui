import { useDictStoreHook } from "@/store/modules/dict";
import { selectByCode } from "@/api/system/dict.data";
import { ref, toRefs } from "vue";

const dictStore = useDictStoreHook();

/**
 * 获取字典数据
 */
export function useDict(...args: any): any {
  const res = ref({});
  return (() => {
    args.forEach((code: String) => {
      // @ts-ignore
      res.value[code] = [];
      const dicts = dictStore.getDict(code);
      if (dicts) {
        // @ts-ignore
        res.value[code] = dicts;
      } else {
        selectByCode(code).then(resp => {
          // @ts-ignore
          res.value[code] = resp.data.map((p: any) => {
            let value = p.value;
            if (p.type === 2) {
              value = Number(value);
            } else if (p.type === 3) {
              value = value === "true" || value === "1"; // Convert to boolean
            }
            return {
              label: p.label,
              value: value,
              elTagType: p.tagType,
              elTagClass: p.tagClass
            };
          });
          // @ts-ignore
          dictStore.setDict(code, res.value[code]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
