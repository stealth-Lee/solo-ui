<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('job.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('job.tip.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.handlerName')" prop="handlerName">
        <el-input
          v-model="formModel.handlerName"
          :placeholder="$t('job.tip.handlerName')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.handlerParams')" prop="handlerParams">
        <el-input
          v-model="formModel.handlerParams"
          :placeholder="$t('job.tip.handlerParams')"
          type="textarea"
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.cron')" prop="cron">
        <el-input
          v-model="formModel.cron"
          :placeholder="$t('job.tip.cron')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.retryCount')" prop="retryCount">
        <el-input-number
          v-model="formModel.retryCount"
          :placeholder="$t('job.tip.retryCount')"
          class="!w-[100%]"
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.retryInterval')" prop="retryInterval">
        <el-input-number
          v-model="formModel.retryInterval"
          :placeholder="$t('job.tip.retryInterval')"
          class="!w-[100%]"
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.policy')" prop="policy">
        <el-input-number
          v-model="formModel.policy"
          :placeholder="$t('job.tip.policy')"
          class="!w-[100%]"
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.concurrent')" prop="concurrent">
        <el-switch
          v-model="formModel.concurrent"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.status')" prop="status">
        <el-switch
          v-model="formModel.status"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item :label="$t('job.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('job.tip.remark')"
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
import { getting, creating, updating } from "@/api/quartz/job";

defineOptions({ name: "QrtzJobForm" });

const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  jobId: undefined,
  name: "",
  handlerName: "",
  handlerParams: "",
  cron: "",
  retryCount: undefined,
  retryInterval: undefined,
  policy: undefined,
  concurrent: undefined,
  status: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  name: [{ required: true, message: t("job.required.name"), trigger: "blur" }],
  handlerName: [{ required: true, message: t("job.required.handlerName"), trigger: "blur" }],
});

// 打开弹框
const openDialog = async (title: string, id?: number) => {
  visible.value = true;
  formTitle.value = title;
  resetForm();
  if (id) {
    try {
      formLoading.value = true;
      const { data } = await getting(id);
      Object.assign(formModel, data);
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
    formModel.jobId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.jobId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
