<template>
  <el-form
    ref="basicInfoForm"
    :model="formModel"
    :rules="formRules"
    label-width="150px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input placeholder="请输入表名称" v-model="formModel.tableName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            placeholder="请输入表描述"
            v-model="formModel.tableComment"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实体类名称" prop="className">
          <el-input
            placeholder="请输入实体类名称"
            v-model="formModel.className"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="author">
          <el-input placeholder="请输入作者" v-model="formModel.author" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="formModel.remark" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
const props = defineProps({
  table: {
    type: Object,
    default: () => null
  }
});

const formModel = reactive({
  tableName: "",
  tableComment: "",
  className: "",
  author: "",
  remark: ""
});

// 自定义表单规则校验
const formRules = reactive({
  tableName: [{ required: true, message: "请输入表名称", trigger: "blur" }],
  tableComment: [{ required: true, message: "请输入表描述", trigger: "blur" }],
  className: [{ required: true, message: "请输入实体类名称", trigger: "blur" }],
  functionAuthor: [{ required: true, message: "请输入作者", trigger: "blur" }]
});

/** 监听 table 属性，复制给 formData 属性 */
watch(
  () => props.table,
  table => {
    if (!table) return;
    Object.assign(formModel, table);
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
