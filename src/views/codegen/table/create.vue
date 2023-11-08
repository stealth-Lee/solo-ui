<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('table.column.source')" prop="sourceId">
        <el-select
          v-model="formModel.sourceId"
          :placeholder="$t('table.tip.source')"
          filterable
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
      <el-form-item :label="$t('table.column.selectTable')" prop="name">
        <el-select
          v-model="formModel.name"
          :placeholder="$t('table.tip.selectTable')"
          filterable
        >
          <el-option
            v-for="item in table"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            <span style="float: left">{{ item.name }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ item.comment }}</span
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
  name: ""
});
const datasource = ref([]);
const table = ref([]);

/** 自定义表单规则校验 */
const formRules = reactive({
  sourceId: [{ required: true, message: "数据源为必填项", trigger: "blur" }],
  name: [{ required: true, message: "表为必填项", trigger: "blur" }]
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
    message.success(`${formTitle.value}[${formModel.name}]成功！`);
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
