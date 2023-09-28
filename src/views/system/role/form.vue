<template>
  <el-dialog :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="formModel.roleName"
          clearable
          placeholder="请输入角色名称"
        />
      </el-form-item>

      <el-form-item label="角色标识" prop="roleCode">
        <el-input
          v-model="formModel.roleCode"
          clearable
          placeholder="请输入角色标识"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formModel.status">
          <el-radio-button
            :label="item.value"
            v-for="(item, index) in status"
            :key="index"
            >{{ item.label }}
          </el-radio-button>
        </el-radio-group>
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
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "@/utils/message";

import { useDict } from "@/hooks/dict";
import { getting, creating, updating } from "@/api/system/role";

defineOptions({ name: "SysRoleForm" });

const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const { status } = useDict("status");
const formModel = reactive({
  roleId: undefined,
  roleName: "",
  roleCode: "",
  dataScope: 1,
  status: 1,
  remark: ""
});

/** 自定义表单规则校验 */
const formRules = reactive({
  roleName: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  roleCode: [{ required: true, message: "角色标识为必填项", trigger: "blur" }]
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
    message(`角色[${formModel.roleName}]${formTitle.value}成功！`, {
      type: "success"
    });
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
