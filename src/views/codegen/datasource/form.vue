<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="95px"
    >
      <el-form-item label="连接名" prop="name">
        <el-input
          v-model="formModel.name"
          clearable
          placeholder="请输入连接名"
        />
      </el-form-item>
      <el-form-item label="数据源URL" prop="url">
        <el-input
          v-model="formModel.url"
          clearable
          placeholder="请输入数据源URL"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="formModel.username"
          clearable
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formModel.password"
          clearable
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formModel.remark"
          placeholder="请输入备注信息"
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
import { ref, reactive } from "vue";
import { useMessage } from "@/hooks/message";

import { getting, creating, updating } from "@/api/codegen/datasource";

defineOptions({ name: "CodegenDatasourceForm" });

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
  name: [{ required: true, message: "连接名为必填项", trigger: "blur" }],
  url: [{ required: true, message: "数据源URL为必填项", trigger: "blur" }],
  username: [{ required: true, message: "用户名为必填项", trigger: "blur" }],
  password: [{ required: true, message: "密码为必填项", trigger: "blur" }]
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
    message.success(`${formTitle.value}[${formModel.name}]成功！`);
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
