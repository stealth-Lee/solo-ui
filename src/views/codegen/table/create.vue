<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item label="数据源" prop="sourceId">
        <el-select
          v-model="formModel.sourceId"
          filterable
          placeholder="Select"
          @change="handleSelectDatasource(formModel.sourceId)"
        >
          <el-option
            v-for="item in datasource"
            :key="item.sourceId"
            :label="item.name"
            :value="item.sourceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择表" prop="tableName">
        <el-select
          v-model="formModel.tableName"
          filterable
          placeholder="Select"
        >
          <el-option
            v-for="item in table"
            :key="item.tableName"
            :label="item.tableName"
            :value="item.tableName"
          >
            <span style="float: left">{{ item.tableName }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ item.tableComment }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useMessage } from "@/hooks/message";
import { listSimple } from "@/api/codegen/datasource";
import { listSimple as listSimpleTable, creating } from "@/api/codegen/table";

defineOptions({ name: "GenTableCreate" });

const message = useMessage();

const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  sourceId: undefined,
  tableName: ""
});
const datasource = ref([]);
const table = ref([]);

/** 自定义表单规则校验 */
const formRules = reactive({
  sourceId: [{ required: true, message: "数据源为必填项", trigger: "blur" }],
  tableName: [{ required: true, message: "表为必填项", trigger: "blur" }]
});

// 打开弹框
const openDialog = async (title: string) => {
  visible.value = true;
  formTitle.value = title;
  resetForm();
  try {
    formLoading.value = true;
    const res = await listSimple();
    datasource.value = res.data;
  } finally {
    formLoading.value = false;
  }
};

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    await creating(formModel);
    message.success(`${formTitle.value}[${formModel.tableName}]成功！`);
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

const handleSelectDatasource = async (value: any) => {
  console.log(value);
  const res = await listSimpleTable(value);
  table.value = res.data;
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
