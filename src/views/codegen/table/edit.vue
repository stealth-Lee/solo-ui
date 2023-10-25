<template>
  <el-drawer
    :title="formTitle"
    v-model="visible"
    size="1300"
    row-key="columnId"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basicInfo">
        <BasicInfoTab
          ref="basicInfoTabRef"
          :table="result.table"
          :columns="result.columns"
        />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="columnInfo">
        <ColumnInfoTab ref="columnInfoRef" :columns="result.columns" />
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

defineOptions({ name: "GenTableEdit" });

const BasicInfoTab = defineAsyncComponent(
  () => import("./edit/basic-info-tab.vue")
);
const ColumnInfoTab = defineAsyncComponent(
  () => import("./edit/column-info-tab.vue")
);
const message = useMessage();
const basicInfoTabRef = ref();
const activeName = ref("columnInfo");
const visible = ref(false);
const formTitle = ref("");
const result = ref({
  table: {},
  columns: [] as any[]
});

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
  if (!unref(result)) return;
  await unref(basicInfoTabRef)?.validate();
  await updateTable(result.value);
  message.success(`${formTitle.value}成功！`);
  visible.value = false;
  emit("refresh");
};

defineExpose({ openDialog });
</script>
