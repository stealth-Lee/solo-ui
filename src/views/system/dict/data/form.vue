<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('dictData.column.code')" prop="code">
        <el-input
          v-model="formModel.code"
          :placeholder="$t('dictData.tip.code')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.label')" prop="label">
        <el-input
          v-model="formModel.label"
          :placeholder="$t('dictData.tip.label')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.value')" prop="value">
        <el-input
          v-model="formModel.value"
          :placeholder="$t('dictData.tip.value')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.tagType')" prop="tagType">
        <el-select
          v-model="formModel.tagType"
          :placeholder="$t('dictData.tip.tagType')"
          clearable
        >
          <el-option
            v-for="dict in tag_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dictData.column.tagClass')" prop="tagClass">
        <el-input
          v-model="formModel.tagClass"
          :placeholder="$t('dictData.tip.tagClass')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.dictSort')" prop="dictSort">
        <el-input-number v-model="formModel.dictSort" />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.status')" prop="status">
        <el-switch
          v-model="formModel.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('dictData.tip.remark')"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{
          t("buttons.common.cancel")
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          t("buttons.common.confirm")
        }}</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { getting, creating, updating } from "@/api/system/dict.data";

defineOptions({ name: "SysDictDataForm" });

const { t } = useI18n();
const { tag_type } = useDict("tag_type");
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  dataId: undefined,
  code: "",
  value: "",
  label: "",
  tagType: undefined,
  tagClass: "",
  dictSort: undefined,
  status: 1,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  code: [
    { required: true, message: t("dictData.required.code"), trigger: "blur" }
  ],
  value: [
    { required: true, message: t("dictData.required.value"), trigger: "blur" }
  ],
  label: [
    { required: true, message: t("dictData.required.label"), trigger: "blur" }
  ],
  status: [
    { required: true, message: t("dictData.required.status"), trigger: "blur" }
  ]
});

// 打开弹框
const openDialog = async (title: string, id?: number, code?: string) => {
  visible.value = true;
  formTitle.value = title;
  resetForm();
  if (code) formModel.code = code;
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
    formModel.dataId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.dataId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
