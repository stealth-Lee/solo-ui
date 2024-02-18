<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('post.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('post.tip.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('post.column.code')" prop="code">
        <el-input
          v-model="formModel.code"
          :placeholder="$t('post.tip.code')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('post.column.sort')" prop="sort">
        <el-input-number
          v-model="formModel.sort"
          :placeholder="$t('post.tip.sort')"
          class="!w-[100%]"
        />
      </el-form-item>
      <el-form-item :label="$t('post.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('post.tip.remark')"
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
import { getting, creating, updating } from "@/api/system/post";

defineOptions({ name: "SysPostForm" });

const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  postId: undefined,
  name: "",
  code: "",
  sort: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
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
    formModel.postId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.postId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
