<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="95px"
    >
      <el-form-item :label="$t('datasource.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('datasource.tip.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('datasource.column.url')" prop="url">
        <el-input
          v-model="formModel.url"
          :placeholder="$t('datasource.tip.url')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('datasource.column.username')" prop="username">
        <el-input
          v-model="formModel.username"
          :placeholder="$t('datasource.tip.username')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('datasource.column.password')" prop="password">
        <el-input
          v-model="formModel.password"
          :placeholder="$t('datasource.tip.password')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('datasource.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('datasource.tip.remark')"
          type="textarea"
        />
      </el-form-item>
    </el-form>
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

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useMessage } from "@/hooks/message";

import { getting, creating, updating } from "@/api/codegen/datasource";

defineOptions({ name: "CodegenDatasourceForm" });

const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  sourceId: undefined,
  name: "",
  url: "",
  username: "",
  password: "",
  remark: ""
});

/** 自定义表单规则校验 */
const formRules = reactive({
  name: [
    { required: true, message: t("datasource.required.name"), trigger: "blur" }
  ],
  url: [
    { required: true, message: t("datasource.required.url"), trigger: "blur" }
  ],
  username: [
    {
      required: true,
      message: t("datasource.required.username"),
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: t("datasource.required.password"),
      trigger: "blur"
    }
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
    formModel.sourceId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.sourceId = undefined;
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
