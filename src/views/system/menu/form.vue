<template>
  <el-drawer :title="formTitle" v-model="visible" width="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-loading="formLoading"
      label-width="82px"
    >
      <el-form-item :label="$t('menu.column.parentMenu')" prop="parentId">
        <el-cascader
          v-model="formModel.parentId"
          :placeholder="$t('menu.tip.parentMenu')"
          :options="menuTree"
          :props="{
            value: 'menuId',
            label: 'name',
            emitPath: false,
            checkStrictly: true
          }"
          clearable
          filterable
          class="w-full"
        />
      </el-form-item>
      <el-form-item :label="$t('menu.column.type')" prop="type">
        <el-radio-group v-model="formModel.type">
          <el-radio-button
            v-for="(item, index) in menu_type"
            :key="index"
            :label="item.value"
            >{{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('menu.column.name')" prop="name">
        <el-input
          v-model="formModel.name"
          :placeholder="$t('menu.tip.name')"
          clearable
        >
          <template #append>
            <el-button :icon="useRenderIcon('ep:edit-pen')" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="formModel.type != 'B'"
        :label="$t('menu.column.icon')"
        prop="icon"
      >
        <IconSelect v-model="formModel.icon" />
      </el-form-item>
      <el-form-item
        v-if="formModel.type != 'B'"
        :label="$t('menu.column.path')"
        prop="path"
      >
        <el-input
          v-model="formModel.path"
          :placeholder="$t('menu.tip.path')"
          clearable
        />
      </el-form-item>
      <el-form-item
        v-if="formModel.type === 'B'"
        :label="$t('menu.column.permission')"
        prop="permission"
      >
        <el-input
          v-model="formModel.permission"
          :placeholder="$t('menu.tip.permission')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('menu.column.visible')" prop="visible">
        <el-switch v-model="formModel.visible" />
      </el-form-item>
      <el-form-item :label="$t('menu.column.keepAlive')" prop="keepAlive">
        <el-switch v-model="formModel.keepAlive" />
      </el-form-item>
      <el-form-item :label="$t('menu.column.sort')" prop="sort">
        <el-input-number
          v-model="formModel.sort"
          :placeholder="$t('menu.tip.sort')"
          class="!w-[100%]"
        />
      </el-form-item>
      <el-form-item :label="$t('menu.column.remark')" prop="remark">
        <el-input
          v-model="formModel.remark"
          :placeholder="$t('menu.tip.remark')"
          type="textarea"
        />
      </el-form-item>
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

<script setup lang="ts">
import { handleTree } from "@/utils/tree";
import { getting, creating, updating, listSimple } from "@/api/system/menu";
import { IconSelect } from "@/components/ReIcon";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({ name: "SysMenuForm" });

const { menu_type } = useDict("menu_type");
const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const menuTree = ref(); // 树形结构

const formModel = reactive({
  menuId: undefined,
  parentId: undefined,
  type: "D",
  name: "",
  icon: "",
  path: "",
  permission: "",
  visible: true,
  keepAlive: false,
  sort: undefined,
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  type: [{ required: true, message: t("menu.required.type"), trigger: "blur" }],
  name: [{ required: true, message: t("menu.required.name"), trigger: "blur" }],
  visible: [
    { required: true, message: t("menu.required.visible"), trigger: "blur" }
  ],
  keepAlive: [
    { required: true, message: t("menu.required.keepAlive"), trigger: "blur" }
  ]
});

// 打开弹框
const openDialog = async (title: string, id?: number) => {
  visible.value = true;
  formTitle.value = title;
  resetForm();
  const type = ["D", "M"];
  const treeRes = await listSimple(type);
  menuTree.value = handleTree(treeRes.data, "menuId");
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
    formModel.menuId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.menuId = "";
  formRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>
