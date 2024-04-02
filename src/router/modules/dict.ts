import { dict } from "@/router/enums";

export default {
  path: "/system",
  meta: {
    icon: "edit",
    title: "字典",
    rank: dict,
    showLink: false
  },
  children: [
    {
      path: "/system/dict/data/:code",
      name: "SystemDictData",
      component: () => import("@/views/system/dict/data/index.vue"),
      meta: {
        title: "字典数据",
        activePath: "/system/dict"
      }
    }
  ]
} as RouteConfigsTable;
