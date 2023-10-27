import { dict } from "@/router/enums";

export default {
  path: "/system",
  meta: {
    icon: "edit",
    title: "字典",
    rank: dict
  },
  children: [
    {
      path: "/system/dict/data/:dictCode",
      name: "SystemDictData",
      component: () => import("@/views/system/dict/data/index.vue"),
      meta: {
        title: "字典数据",
        keepAlive: true,
        showLink: true,
        activePath: "/system/dict",
        hiddenTag: true,
        dynamicLevel: 3
      }
    }
  ]
} as RouteConfigsTable;
