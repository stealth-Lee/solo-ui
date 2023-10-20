<template>
  <el-drawer :title="formTitle" v-model="visible" size="1300">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basicInfo">
        <BasicInfoForm ref="basicInfoRef" :table="result.table" />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="column">
        <ColumnInfoForm ref="columnInfoRef" :columns="result.columns" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="tsx">
import {
  getting as getTable,
  updating as updateTable
} from "@/api/codegen/table";
import { listing as listColumn } from "@/api/codegen/column";

const BasicInfoForm = defineAsyncComponent(
  () => import("./edit/basic-info-form.vue")
);
const ColumnInfoForm = defineAsyncComponent(
  () => import("./edit/column-info-form.vue")
);
const activeName = ref("column"); // Tag 激活的窗口

const result = ref({
  table: {},
  columns: []
});

const visible = ref(false);
const formTitle = ref("");

// 打开弹框
const openDialog = async (title: string, id: number) => {
  visible.value = true;
  formTitle.value = title;
  const tableRes = await getTable(id);
  const columnRes = await listColumn(id);
  result.value.table = tableRes.data;
  result.value.columns = columnRes.data;
};

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  await updateTable(result.value);
};

defineExpose({ openDialog });
</script>
