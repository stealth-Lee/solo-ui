<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('config.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('config.tip.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('config.column.key')" prop="key">
        <el-input
          v-model="formModel.key"
          :placeholder="$t('config.tip.key')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('config.column.value')" prop="value">
        <el-input
          v-model="formModel.value"
          :placeholder="$t('config.tip.value')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('config.column.isSys')" prop="isSys">
        <el-select
          v-model="formModel.isSys"
          :placeholder="$t('config.tip.isSys')"
          clearable
        >
          <el-option
            v-for="dict in is_sys"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('config.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('config.tip.remark')"
          type="textarea"
        />
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
import { getting, creating, updating } from "@/api/system/config";

defineOptions({ name: "SysConfigForm" });

const { t } = useI18n();
const { is_sys } = useDict("is_sys");
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  configId: "undefined",
  name: "",
  key: "",
  value: "",
  isSys: "true",
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  name: [
    { required: true, message: t("config.required.name"), trigger: "blur" }
  ],
  key: [{ required: true, message: t("config.required.key"), trigger: "blur" }],
  value: [
    { required: true, message: t("config.required.value"), trigger: "blur" }
  ]
});

// 打开弹框
const openDialog = async (title: string, id?: number) => {
  visible.value = true;
  formTitle.value = title;
  resetForm();
  if (id) {
    try {
      formLoading.value = true;
      const res = await getting(id);
      Object.assign(formModel, res.data);
    } finally {
      formLoading.value = false;
    }
  }
};

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    formModel.configId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.configId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
