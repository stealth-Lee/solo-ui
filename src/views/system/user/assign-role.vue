<template>
  <el-drawer :title="$t('user.passwordTitle')" v-model="visible" size="40%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.username')" prop="username">
            <el-input
              disabled
              v-model="formModel.username"
              :placeholder="$t('user.tip.username')"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.nickname')" prop="nickname">
            <el-input
              disabled
              v-model="formModel.nickname"
              :placeholder="$t('user.tip.nickname')"
            />
          </el-form-item>
        </re-col>
        <el-divider content-position="left">分配角色</el-divider>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
const formRef = ref();
const formModel = reactive({
  username: "",
  nickname: ""
});
const formRules = reactive({});
const visible = ref(false);
const formLoading = ref(false);

// 打开弹窗
const openDialog = async (userId: number) => {
  visible.value = true;
};

defineExpose({ openDialog });
</script>
