<template>
  <el-drawer title="菜单权限" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      v-loading="formLoading"
      label-width="95px"
    >
      <el-card>
        <template #header>
          <el-tag>{{ formModel.name }}</el-tag>
        </template>
        <el-tree
          ref="menuTreeRef"
          :props="defaultProps"
          :data="menuTree"
          node-key="menuId"
          show-checkbox
        />
      </el-card>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{
          t("buttons.common.cancel")
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          t("buttons.common.confirm")
        }}</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { handleTree } from "@/utils/tree";
import { listSimple } from "@/api/system/menu";
import { assignMenu, queryMenuIds } from "@/api/system/role.menu";
import { RoleReq } from "@/api/system/role";
const formRef = ref();
const menuTreeRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const menuTree = ref<any[]>([]);
const { t } = useI18n();
const message = useMessage();

const formModel = reactive({
  roleId: 0,
  name: "",
  code: "",
  menuIds: []
});

const defaultProps = {
  children: "children",
  label: "name"
};

// 打开弹框
const open = async (role: RoleReq) => {
  visible.value = true;
  formModel.roleId = role.roleId;
  formModel.name = role.name;
  formModel.code = role.code;
  formLoading.value = true;
  const treeRes = await listSimple();
  menuTree.value = handleTree(treeRes.data, "menuId");
  const menuRes = await queryMenuIds(role.roleId);
  formModel.menuIds = menuRes.data;
  // 设置选中
  formModel.menuIds.forEach((menuId: number) => {
    menuTreeRef.value.setChecked(menuId, true, false);
  });
  formLoading.value = false;
};

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  // 提交请求
  formLoading.value = true;
  try {
    const data = {
      roleId: formModel.roleId,
      menuIds: [
        ...(menuTreeRef.value.getCheckedKeys(
          false
        ) as unknown as Array<number>), // 获得当前选中节点
        ...(menuTreeRef.value.getHalfCheckedKeys() as unknown as Array<number>) // 获得半选中的父节点
      ]
    };
    await assignMenu(data);
    message.success();
    visible.value = false;
    // 发送操作成功的事件
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

defineExpose({ open });
</script>
