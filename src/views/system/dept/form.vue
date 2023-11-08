<template>
  <el-drawer :title="formTitle" v-model="visible" size="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="11">
        <el-col>
          <el-form-item :label="$t('dept.column.parentDept')" prop="parentId">
            <el-cascader
              v-model="formModel.parentId"
              :placeholder="$t('dept.tip.parentDept')"
              :options="deptTree"
              :props="{
                value: 'deptId',
                label: 'name',
                emitPath: false,
                checkStrictly: true,
                expandTrigger: 'hover' as const
              }"
              clearable
              filterable
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('dept.column.name')" prop="name">
            <el-input
              v-model="formModel.name"
              :placeholder="$t('dept.tip.name')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('dept.column.code')" prop="code">
            <el-input
              v-model="formModel.code"
              :placeholder="$t('dept.tip.code')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('dept.column.sort')" prop="sort">
            <el-input-number
              v-model="formModel.sort"
              :placeholder="$t('dept.tip.sort')"
              class="!w-[100%]"
              :min="0"
              :max="9999"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('dept.column.remark')" prop="remark">
            <el-input
              v-model="formModel.remark"
              :placeholder="$t('dept.tip.remark')"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{
          t("commons.buttons.cancel")
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          t("commons.buttons.confirm")
        }}</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { handleTree } from "@/utils/tree";
import { listSimple, getting, creating, updating } from "@/api/system/dept";

const { t } = useI18n();
const message = useMessage();
const formRef = ref();
const deptTree = ref(); // 树形结构
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  deptId: undefined,
  parentId: 0,
  name: "",
  code: "",
  sort: 10,
  remark: ""
});

/** 自定义表单规则校验 */
const formRules = reactive({
  name: [{ required: true, message: t("dept.required.name"), trigger: "blur" }],
  code: [{ required: true, message: t("dept.required.code"), trigger: "blur" }],
  sort: [{ required: true, message: t("dept.required.sort"), trigger: "blur" }]
});

// 重置表单
const resetForm = () => {
  formModel.deptId = "";
  formRef.value?.resetFields();
};

// 打开弹框
const openDialog = async (title: string, id?: number) => {
  visible.value = true;
  formTitle.value = title;
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

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    formModel.deptId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

defineExpose({ openDialog });
</script>
