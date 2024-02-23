<template>
  <el-drawer
    :title="t('navbar.buttons.personalCenter')"
    v-model="visible"
    size="40%"
  >
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane :label="t('navbar.label.basicInfo')" name="basicInfo">
        <BasicInfo ref="basicInfoRef" />
      </el-tab-pane>
      <el-tab-pane :label="t('navbar.label.securityInfo')" name="securityInfo">
        <SecurityInfo ref="securityInfoRef" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts">
const BasicInfo = defineAsyncComponent(() => import("./basic-info.vue"));
const SecurityInfo = defineAsyncComponent(() => import("./security-info.vue"));
const { t } = useI18n();
const basicInfoRef = ref();
const securityInfoRef = ref();
const visible = ref(false);
const activeName = ref("basicInfo");

// 打开弹框
const openDialog = async () => {
  visible.value = true;
};

defineExpose({ openDialog });
</script>
