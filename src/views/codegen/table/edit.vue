<template>
  <el-drawer
    :title="formTitle"
    v-model="visible"
    size="1300"
    row-key="columnId"
  >
    <el-tabs v-model="activeName" v-loading="formLoading">
      <el-tab-pane :label="$t('genColumn.message.basicInfo')" name="basicInfo">
        <BasicInfoTab
          ref="basicInfoTabRef"
          :table="result.table"
          :columns="result.columns"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('genColumn.message.fieldInfo')" name="columnInfo">
        <ColumnInfoTab
          ref="columnInfoRef"
          :table="result.table"
          :columns="result.columns"
        />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{
          t("commons.buttons.cancel")
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          t("commons.buttons.confirm")
        }}</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="tsx">
import {
  TableReq,
  getting as getTable,
  updating as updateTable
} from "@/api/codegen/table";
import { ColumnReq, listing as listColumn } from "@/api/codegen/column";

defineOptions({ name: "GenTableEdit" });

const { t } = useI18n();
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
const formLoading = ref(false);
const formTitle = ref("");
const result = ref({
  table: {} as TableReq,
  columns: [] as ColumnReq[]
});

// 打开弹框
const openDialog = async (title: string, id: number) => {
  try {
    formLoading.value = true;
    visible.value = true;
    formTitle.value = title;
    const tableRes = await getTable(id);
    const columnRes = await listColumn(id);
    result.value.table = tableRes.data;
    result.value.columns = columnRes.data;
    formLoading.value = false;
  } finally {
    formLoading.value = false;
  }
};

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  try {
    formLoading.value = true;
    if (!unref(result)) return;
    await unref(basicInfoTabRef)?.validate();
    await updateTable(result.value);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

defineExpose({ openDialog });
</script>
