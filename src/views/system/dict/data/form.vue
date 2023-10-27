<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item label="字典编码" prop="dictCode">
        <el-input
          v-model="formModel.dictCode"
          placeholder="请输入字典编码"
          clearable
        />
      </el-form-item>
      <el-form-item label="字典键值" prop="dictValue">
        <el-input
          v-model="formModel.dictValue"
          placeholder="请输入字典键值"
          clearable
        />
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="formModel.dictLabel"
          placeholder="请输入字典标签"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="标签类型[0:default 1:primary 2:success 3:info 4:warning 5:danger]"
        prop="tagType"
      >
        <el-select
          v-model="formModel.tagType"
          placeholder="请选择标签类型[0:default 1:primary 2:success 3:info 4:warning 5:danger]"
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
        <el-input
          v-model="formModel.dictSort"
          placeholder="请输入字典排序"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态[0禁用 1正常]" prop="status">
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
          clearable
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

defineOptions({ name: "SystemDictDataForm" });

const { tag_type } = useDict("tag_type");
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  dataId: undefined,
  dictCode: "",
  dictValue: "",
  dictLabel: "",
  tagType: undefined,
  tagClass: "",
  dictSort: undefined,
  status: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  dictCode: [{ required: true, message: "字典编码为必填项", trigger: "blur" }],
  dictValue: [{ required: true, message: "字典键值为必填项", trigger: "blur" }],
  dictLabel: [{ required: true, message: "字典标签为必填项", trigger: "blur" }],
  status: [
    { required: true, message: "状态[0禁用 1正常]为必填项", trigger: "blur" }
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
