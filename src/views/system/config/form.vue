<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="formModel.name"
          placeholder="请输入配置名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="配置键" prop="key">
        <el-input
          v-model="formModel.key"
          placeholder="请输入配置键"
          clearable
        />
      </el-form-item>
      <el-form-item label="配置值" prop="value">
        <el-input
          v-model="formModel.value"
          placeholder="请输入配置值"
          clearable
        />
      </el-form-item>
      <el-form-item label="系统标识" prop="isSys">
        <el-select
          v-model="formModel.isSys"
          placeholder="请选择系统标识"
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
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formModel.remark"
          placeholder="请输入备注"
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
  name: [{ required: true, message: "配置名称为必填项", trigger: "blur" }],
  key: [{ required: true, message: "配置键为必填项", trigger: "blur" }],
  value: [{ required: true, message: "配置值为必填项", trigger: "blur" }]
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
    message.success(`${formTitle.value}成功！`);
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
