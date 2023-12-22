<template>
  <ElDialog :title="$t('user.passwordTitle')" v-model="visible" width="500">
    <ElForm ref="formRef" :model="formModel" v-loading="formLoading">
      <ElFormItem prop="password" :rules="formRules">
        <ElInput
          clearable
          show-password
          type="password"
          v-model="formModel.password"
          placeholder="请输入新密码"
        />
      </ElFormItem>
    </ElForm>
    <div class="mt-4 flex">
      <div
        v-for="(item, idx) in pwdProgress"
        :key="idx"
        class="w-[19vw]"
        :style="{ marginLeft: idx !== 0 ? '4px' : 0 }"
      >
        <el-progress
          striped
          striped-flow
          :duration="curScore === idx ? 6 : 0"
          :percentage="curScore >= idx ? 100 : 0"
          :color="item.color"
          :stroke-width="10"
          :show-text="false"
        />
        <p
          class="text-center"
          :style="{ color: curScore === idx ? item.color : '' }"
        >
          {{ item.text }}
        </p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { isAllEmpty } from "@pureadmin/utils";
import { zxcvbn } from "@zxcvbn-ts/core";
import { resetPassword } from "@/api/system/user";

const message = useMessage();
const formRef = ref();
const curScore = ref();
const visible = ref(false);
const formLoading = ref(false);
const formModel = reactive({
  userId: undefined,
  password: ""
});

const formRules = reactive({
  username: [{ required: true, message: "请输入新密码", trigger: "blur" }]
});

// 打开弹窗
const openDialog = async (userId: number) => {
  visible.value = true;
  formModel.userId = userId;
  formModel.password = "";
};

// 监听密码变化
watch(
  formModel,
  ({ password }) =>
    (curScore.value = isAllEmpty(password) ? -1 : zxcvbn(password).score)
);

const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    resetPassword(formModel.userId, formModel.password);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

defineExpose({ openDialog });

const pwdProgress = [
  { color: "#e74242", text: "非常弱" },
  { color: "#EFBD47", text: "弱" },
  { color: "#ffa500", text: "一般" },
  { color: "#1bbf1b", text: "强" },
  { color: "#008000", text: "非常强" }
];
</script>
