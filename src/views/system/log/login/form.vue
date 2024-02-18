<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('operateLog.column.title')" prop="title">
        <el-input
          v-model="formModel.title"
          :placeholder="$t('operateLog.tip.title')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('operateLog.column.type')" prop="type">
        <el-select
          v-model="formModel.type"
          :placeholder="$t('operateLog.tip.type')"
          clearable
          class="!w-[100%]"
        >
          <el-option
            v-for="dict in logger_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operateLog.column.method')" prop="method">
        <el-input
          v-model="formModel.method"
          :placeholder="$t('operateLog.tip.method')"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.requestUrl')"
        prop="requestUrl"
      >
        <el-input
          v-model="formModel.requestUrl"
          :placeholder="$t('operateLog.tip.requestUrl')"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.requestMethod')"
        prop="requestMethod"
      >
        <el-input
          v-model="formModel.requestMethod"
          :placeholder="$t('operateLog.tip.requestMethod')"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.requestData')"
        prop="requestData"
      >
        <el-input
          v-model="formModel.requestData"
          :placeholder="$t('operateLog.tip.requestData')"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.responseData')"
        prop="responseData"
      >
        <el-input
          v-model="formModel.responseData"
          :placeholder="$t('operateLog.tip.responseData')"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.exceptionInfo')"
        prop="exceptionInfo"
      >
        <el-input
          v-model="formModel.exceptionInfo"
          :placeholder="$t('operateLog.tip.exceptionInfo')"
          type="textarea"
        />
      </el-form-item>
      <el-form-item :label="$t('operateLog.column.userIp')" prop="userIp">
        <el-input
          v-model="formModel.userIp"
          :placeholder="$t('operateLog.tip.userIp')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('operateLog.column.userAgent')" prop="userAgent">
        <el-input
          v-model="formModel.userAgent"
          :placeholder="$t('operateLog.tip.userAgent')"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.deviceName')"
        prop="deviceName"
      >
        <el-input
          v-model="formModel.deviceName"
          :placeholder="$t('operateLog.tip.deviceName')"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.browserName')"
        prop="browserName"
      >
        <el-input
          v-model="formModel.browserName"
          :placeholder="$t('operateLog.tip.browserName')"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('operateLog.column.executionTime')"
        prop="executionTime"
      >
        <el-input-number
          v-model="formModel.executionTime"
          :placeholder="$t('operateLog.tip.executionTime')"
          class="!w-[100%]"
        />
      </el-form-item>
      <el-form-item :label="$t('operateLog.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('operateLog.tip.remark')"
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
import { getting } from "@/api/system/log.operate";

defineOptions({ name: "SysOperateLogForm" });

const { logger_type } = useDict("logger_type");
const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  operateId: undefined,
  title: "",
  type: undefined,
  method: "",
  requestUrl: "",
  requestMethod: "",
  requestData: "",
  responseData: "",
  exceptionInfo: "",
  userIp: "",
  userAgent: "",
  deviceName: "",
  browserName: "",
  executionTime: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({});

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
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.operateId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
