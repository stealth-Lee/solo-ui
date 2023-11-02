<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item label="字典编码" prop="code">
        <el-input
          v-model="formModel.code"
          placeholder="请输入字典编码"
          clearable
        />
      </el-form-item>
      <el-form-item label="字典键值" prop="value">
        <el-input
          v-model="formModel.value"
          placeholder="请输入字典键值"
          clearable
        />
      </el-form-item>
      <el-form-item label="字典标签" prop="label">
        <el-input
          v-model="formModel.label"
          placeholder="请输入字典标签"
          clearable
        />
      </el-form-item>
      <el-form-item label="标签类型" prop="tagType">
        <el-select
          v-model="formModel.tagType"
          placeholder="请选择标签类型"
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
      <el-form-item label="标签样式" prop="tagClass">
        <el-input
          v-model="formModel.tagClass"
          placeholder="请输入标签样式"
          clearable
        />
      </el-form-item>
      <el-form-item label="字典排序" prop="dictSort">
        <el-input-number v-model="formModel.dictSort" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="formModel.status"
          active-value="1"
          inactive-value="0"
        />
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
import { getting, creating, updating } from "@/api/system/dict.data";

defineOptions({ name: "SysDictDataForm" });

const { tag_type, status } = useDict("tag_type", "status");
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
  status: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  code: [{ required: true, message: "字典编码为必填项", trigger: "blur" }],
  value: [{ required: true, message: "字典键值为必填项", trigger: "blur" }],
  label: [{ required: true, message: "字典标签为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
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
    formModel.dataId ? await updating(formModel) : await creating(formModel);
    message.success(`${formTitle.value}成功！`);
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
