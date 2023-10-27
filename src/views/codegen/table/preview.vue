<template>
  <el-drawer title="预览代码" v-model="visible" size="80%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-scrollbar height="calc(100vh - 100px)" class="mt20">
        <el-tab-pane
          v-for="item in previewCodegen"
          :key="item.path"
          :label="item.path.substring(item.path.lastIndexOf('/') + 1)"
          :name="item.path"
        >
          <el-button
            class="float-right"
            text
            type="primary"
            @click="copy(item.code)"
          >
            复制
          </el-button>
          <pre><code v-html="highlightedCode(item)" class="hljs"/></pre>
        </el-tab-pane>
      </el-scrollbar>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="tsx">
import "highlight.js/styles/github.css";
import { useClipboard } from "@vueuse/core";
import hljs from "highlight.js";
import java from "highlight.js/lib/languages/java";
import xml from "highlight.js/lib/languages/java";
import ts from "highlight.js/lib/languages/typescript";
import sql from "highlight.js/lib/languages/sql";
import { PreviewReq, preview } from "@/api/codegen/table";

const message = useMessage();
const visible = ref(false);
const activeName = ref("first");
const previewCodegen = ref<PreviewReq[]>([]);

// 代码高亮
const highlightedCode = item => {
  const language = item.path.substring(item.path.lastIndexOf(".") + 1);
  console.log(language);
  const result = hljs.highlight(language, item.code || "", true);
  return result.value || "&nbsp;";
};

// 复制
const copy = async (text: string) => {
  const { copy, copied, isSupported } = useClipboard({ source: text });
  if (!isSupported) {
    message.error("复制失败");
    return;
  }
  await copy();
  if (unref(copied)) {
    message.success("复制成功");
  }
};

// 打开弹框
const openDialog = async (id?: number) => {
  visible.value = true;
  const res = await preview(id);
  previewCodegen.value = res.data;
};
defineExpose({ openDialog });

/** 初始化 **/
onMounted(async () => {
  // 注册代码高亮的各种语言
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("vue", xml);
  hljs.registerLanguage("ts", ts);
  hljs.registerLanguage("sql", sql);
});
</script>
