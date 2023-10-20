<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-width="82px"
      v-loading="formLoading"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="用户名" prop="username">
            <el-input
              :disabled="formModel.userId !== ''"
              v-model="formModel.username"
              clearable
              placeholder="请输入用户名"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="formModel.nickname"
              clearable
              placeholder="请输入用户昵称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="用户密码" prop="password">
            <el-input
              :disabled="formModel.userId !== ''"
              v-model="formModel.password"
              clearable
              placeholder="请输入用户密码"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="用户性别">
            <el-select
              v-model="formModel.sex"
              placeholder="请选择用户性别"
              class="w-full"
              clearable
            >
              <el-option
                v-for="(item, index) in sexOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="formModel.mobile"
              clearable
              placeholder="请输入手机号"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formModel.email"
              clearable
              placeholder="请输入邮箱"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="归属部门" prop="deptId">
            <el-cascader
              class="w-full"
              v-model="formModel.deptId"
              :options="deptTree"
              :props="{
                value: 'deptId',
                label: 'deptName',
                emitPath: false,
                checkStrictly: true,
                expandTrigger: 'hover' as const
              }"
              clearable
              filterable
              placeholder="请选择归属部门"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="用户状态">
            <el-switch
              v-model="formModel.status"
              inline-prompt
              :active-value="0"
              :inactive-value="1"
              active-text="正常"
              inactive-text="停用"
              :style="switchStyle"
            />
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formModel.remark"
              placeholder="请输入备注信息"
              type="textarea"
            />
          </el-form-item>
        </re-col>
      </el-row>
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
import { message } from "@/utils/message";
import ReCol from "@/components/ReCol";
import { usePublicHooks } from "../hooks";

import { handleTree } from "@/utils/tree";

import { creating, updating, getting } from "@/api/system/user";
import { listSimple } from "@/api/system/dept";

const formRef = ref();
const deptTree = ref();
const { switchStyle } = usePublicHooks();
const visible = ref(false);
const formTitle = ref("");
const formLoading = ref(false);

const formModel = reactive({
  userId: undefined,
  deptId: 0,
  username: "",
  password: "",
  nickname: "",
  name: "",
  sex: undefined,
  mobile: "",
  email: "",
  status: 0,
  remark: ""
});

/** 自定义表单规则校验 */
const formRules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  status: [{ required: true, message: "账号状态不能为空", trigger: "blur" }],
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"]
    }
  ]
});

// 打开弹框
const openDialog = async (title: string, id?: number) => {
  visible.value = true;
  formTitle.value = title + "用户";
  resetForm();
  const treeRes = await listSimple();
  deptTree.value = handleTree(treeRes.data, "deptId");
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

// 重置表单
const resetForm = () => {
  formModel.userId = "";
  formRef.value?.resetFields();
};

const sexOptions = [
  {
    value: 0,
    label: "男"
  },
  {
    value: 1,
    label: "女"
  }
];

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    formModel.deptId ? await updating(formModel) : await creating(formModel);
    message(`部门[${formModel.username}]${formTitle.value}成功！`, {
      type: "success"
    });
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

defineExpose({ openDialog });
</script>
