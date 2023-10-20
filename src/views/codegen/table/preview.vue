<template>
  <el-drawer title="预览代码" v-model="visible" size="1200">
    <el-tabs v-model="activeName" class="demo-tabs">
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

        <pre><code v-html="highlightedCode(item)" class="hljs"></code></pre>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";

import { preview } from "@/api/codegen/table";

const visible = ref(false);
const activeName = ref("first");
const previewCodegen = ref([]);

/**
 * 代码高亮
 */
const highlightedCode = item => {
  const language = item.path.substring(item.path.lastIndexOf(".") + 1);
  const result = hljs.highlight("java", item.code || "", true);
  return result.value || "&nbsp;";
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
  hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
  hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
  hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"));
  hljs.registerLanguage(
    "typescript",
    require("highlight.js/lib/languages/typescript")
  );
  hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));
});
</script>
