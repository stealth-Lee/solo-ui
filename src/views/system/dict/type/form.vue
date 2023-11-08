<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="81px"
    >
      <el-form-item :label="$t('dictType.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('dictType.tip.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('dictType.column.code')" prop="code">
        <el-input
          v-model="formModel.code"
          :placeholder="$t('dictType.tip.code')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('dictType.column.type')" prop="type">
        <el-select
          v-model="formModel.type"
          :placeholder="$t('dictType.tip.type')"
          clearable
          class="!w-[100%]"
        >
          <el-option
            v-for="dict in dict_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dictType.column.status')" prop="status">
        <el-switch
          v-model="formModel.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item :label="$t('dictType.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('dictType.tip.remark')"
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
import { getting, creating, updating } from "@/api/system/dict.type";

defineOptions({ name: "SysDictTypeForm" });

const { t } = useI18n();
const { dict_type } = useDict("dict_type");
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  typeId: undefined,
  name: "",
  code: "",
  type: undefined,
  status: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  name: [
    { required: true, message: t("dictType.required.name"), trigger: "blur" }
  ],
  code: [
    { required: true, message: t("dictType.required.code"), trigger: "blur" }
  ],
  dictType: [
    {
      required: true,
      message: t("dictType.required.type"),
      trigger: "blur"
    }
  ],
  status: [
    { required: true, message: t("dictType.required.status"), trigger: "blur" }
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
    formModel.typeId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.typeId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
