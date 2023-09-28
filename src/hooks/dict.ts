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
          res.value[dictType] = resp.data.map((p: any) => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.tagType,
            elTagClass: p.tagClass
          }));
          // @ts-ignore
          dictStore.setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
