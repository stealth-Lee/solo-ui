<template>
  <el-form
    ref="basicInfoTabRef"
    v-loading="formLoading"
    :model="formModel"
    :rules="formRules"
    label-width="80px"
  >
    <el-row>
      <el-col :span="24">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <component
            v-else
            :is="useRenderIcon('ep:user')"
            class="avatar-uploader-icon"
          />
        </el-upload>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.username')" prop="username">
          <el-input
            v-model="formModel.username"
            :placeholder="$t('user.tip.username')"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.nickname')" prop="nickname">
          <el-input
            v-model="formModel.nickname"
            :placeholder="$t('user.tip.nickname')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.name')" prop="name">
          <el-input
            v-model="formModel.name"
            :placeholder="$t('user.tip.name')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.mobile')" prop="mobile">
          <el-input
            v-model="formModel.mobile"
            :placeholder="$t('user.tip.mobile')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.column.email')" prop="email">
          <el-input
            v-model="formModel.email"
            :placeholder="$t('user.tip.email')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="handleSaveUser">
            更新个人信息
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import { currentUser, updatePersonalInfo } from "@/api/system/user";

defineOptions({ name: "SystemBasicInfo" });

const { t } = useI18n();
const message = useMessage();
const basicInfoTabRef = ref();
const formLoading = ref(false);

const formModel = reactive({
  username: useUserStoreHook().username,
  nickname: "",
  name: "",
  mobile: "",
  email: ""
});

// 自定义表单规则校验
const formRules = reactive({
  nickname: [
    { required: true, message: t("user.required.nickname"), trigger: "blur" }
  ],
  name: [{ required: true, message: t("user.required.name"), trigger: "blur" }],
  email: [
    {
      type: "email",
      message: t("user.message.email"),
      trigger: ["blur", "change"]
    }
  ]
});

// 保存用户信息
const handleSaveUser = async () => {
  const valid = await basicInfoTabRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    await updatePersonalInfo(formModel);
    message.success();
  } finally {
    formLoading.value = false;
  }
};

const imageUrl = ref("");

import type { UploadProps } from "element-plus";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type !== "image/jpeg") {
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    return false;
  }
  return true;
};

onMounted(() => {
  currentUser().then(res => {
    const { data } = res;
    Object.assign(formModel, data);
  });
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.component.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
