import { useDictStoreHook } from "@/store/modules/dict";
import { selectByDictCode } from "@/api/system/dict.data";
import { ref, toRefs } from "vue";

const dictStore = useDictStoreHook();

/**
 * 获取字典数据
 */
export function useDict(...args: any): any {
  const res = ref({});
  return (() => {
    args.forEach((dictType: String) => {
      // @ts-ignore
      res.value[dictType] = [];
      const dicts = dictStore.getDict(dictType);
      if (dicts) {
        // @ts-ignore
        res.value[dictType] = dicts;
      } else {
        selectByDictCode(dictType).then(resp => {
          // @ts-ignore
          res.value[dictType] = resp.data.map((p: any) => {
            let value = p.dictValue;
            if (p.dictType === 2) {
              value = Number(value);
            } else if (p.dictType === 3) {
              value = value === "true" || value === "1"; // Convert to boolean
            }
            return {
              label: p.dictLabel,
              value: value,
              elTagType: p.tagType,
              elTagClass: p.tagClass
            };
          });
          // @ts-ignore
          dictStore.setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
