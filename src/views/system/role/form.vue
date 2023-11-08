<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="95px"
    >
      <el-form-item :label="$t('role.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('role.tip.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('role.column.code')" prop="code">
        <el-input
          v-model="formModel.code"
          :placeholder="$t('role.tip.code')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('role.column.status')" prop="status">
        <el-radio-group v-model="formModel.status">
          <el-radio-button
            v-for="(item, index) in status"
            :key="index"
            :label="item.value"
            >{{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('role.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('role.tip.remark')"
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
import { getting, creating, updating } from "@/api/system/role";

defineOptions({ name: "SysRoleForm" });

const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const { status } = useDict("status");
const formModel = reactive({
  roleId: undefined,
  name: "",
  code: "",
  dataScope: 1,
  status: 1,
  remark: ""
});

/** 自定义表单规则校验 */
const formRules = reactive({
  name: [{ required: true, message: t("role.required.name"), trigger: "blur" }],
  code: [{ required: true, message: t("role.required.code"), trigger: "blur" }]
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
    formModel.roleId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.roleId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
