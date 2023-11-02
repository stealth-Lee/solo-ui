<template>
  <el-drawer :title="formTitle" v-model="visible" size="600">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-width="81px"
      v-loading="formLoading"
    >
      <el-row :gutter="11">
        <el-col>
          <el-form-item label="上级部门" prop="parentId">
            <el-cascader
              class="w-full"
              v-model="formModel.parentId"
              :options="deptTree"
              :props="{
                value: 'deptId',
                label: 'deptName',
                emitPath: false,
                checkStrictly: true,
                expandTrigger: 'hover' as const
              }"
              placeholder="请选择上级部门"
              clearable
              filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              v-model="formModel.deptName"
              placeholder="请输入部门名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input
              v-model="formModel.deptCode"
              placeholder="请输入部门编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="deptSort">
            <el-input-number
              v-model="formModel.deptSort"
              placeholder="请输入排序"
              class="!w-[100%]"
              :min="0"
              :max="9999"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formModel.remark"
              placeholder="请输入备注信息"
              type="textarea"
            />
          </el-form-item>
        </el-col>
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
import { handleTree } from "@/utils/tree";
import { listSimple, getting, creating, updating } from "@/api/system/dept";

const message = useMessage();
const formRef = ref();
const deptTree = ref(); // 树形结构
const visible = ref(false);
const formLoading = ref(false);
const formTitle = ref("");
const formModel = reactive({
  deptId: undefined,
  parentId: 0,
  deptName: "",
  deptCode: "",
  deptSort: 10,
  remark: ""
});

/** 自定义表单规则校验 */
const formRules = reactive({
  deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  deptCode: [{ required: true, message: "部门编码不能为空", trigger: "blur" }],
  deptSort: [{ required: true, message: "部门排序不能为空", trigger: "blur" }]
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
    message.success(`部门[${formModel.deptName}]${formTitle.value}成功！`);
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

defineExpose({ openDialog });
</script>
