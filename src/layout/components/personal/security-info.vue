<template>
  <el-form
    ref="securityInfoRef"
    v-loading="formLoading"
    :model="formModel"
    :rules="formRules"
    label-width="80px"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.oldPassword')" prop="oldPassword">
          <el-input
            show-password
            v-model="formModel.oldPassword"
            :placeholder="$t('user.tip.oldPassword')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.newPassword')" prop="newPassword">
          <el-input
            show-password
            v-model="formModel.newPassword"
            :placeholder="$t('user.tip.newPassword')"
          />
          <div class="mt-4 flex">
            <div
              v-for="(item, idx) in pwdProgress"
              :key="idx"
              class="w-[6vw]"
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
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          :label="$t('user.column.confirmPassword')"
          prop="confirmPassword"
        >
          <el-input
            show-password
            v-model="formModel.confirmPassword"
            :placeholder="$t('user.tip.confirmPassword')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword">
            {{ t("user.button.changePassword") }}
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { changePassword } from "@/api/system/user";
import { isAllEmpty } from "@pureadmin/utils";
import { zxcvbn } from "@zxcvbn-ts/core";

defineOptions({ name: "SecurityInfo" });

const { t } = useI18n();
const message = useMessage();
const curScore = ref();
const securityInfoRef = ref();
const formLoading = ref(false);
const formModel = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const validatorConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== formModel.newPassword) {
    callback(new Error(t("user.message.confirmPassword")));
  } else {
    callback();
  }
};

// 自定义表单规则校验
const formRules = reactive({
  oldPassword: [
    { required: true, message: t("user.required.oldPassword"), trigger: "blur" }
  ],
  newPassword: [
    {
      required: true,
      message: t("user.required.newPassword"),
      trigger: "blur"
    },
    {
      min: 6,
      max: 20,
      message: t("user.size.newPassword", { min: 6, max: 20 }),
      trigger: "blur"
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: t("user.required.confirmPassword"),
      trigger: "blur"
    },
    {
      min: 6,
      max: 20,
      message: t("user.size.confirmPassword", { min: 6, max: 20 }),
      trigger: "blur"
    },
    { validator: validatorConfirmPassword, trigger: "blur" }
  ]
});

// 保存用户信息
const handleChangePassword = async () => {
  const valid = await securityInfoRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    await changePassword(formModel);
    message.success();
  } finally {
    formLoading.value = false;
  }
};

// 监听密码变化
watch(
  formModel,
  ({ newPassword }) =>
    (curScore.value = isAllEmpty(newPassword) ? -1 : zxcvbn(newPassword).score)
);

const pwdProgress = [
  { color: "#e74242", text: "" },
  { color: "#EFBD47", text: "" },
  { color: "#ffa500", text: "" },
  { color: "#1bbf1b", text: "" },
  { color: "#008000", text: "" }
];
</script>
