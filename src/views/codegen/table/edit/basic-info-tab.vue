<template>
  <el-form
    ref="basicInfoTabRef"
    :model="formModel"
    :rules="formRules"
    label-width="150px"
  >
    <el-divider content-position="left">基本信息</el-divider>
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input
            placeholder="请输入表名称"
            v-model="formModel.tableName"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            placeholder="请输入表描述"
            v-model="formModel.tableComment"
            disabled
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
        <el-form-item label="功能名" prop="functionName">
          <el-input
            placeholder="请输入功能名"
            v-model="formModel.functionName"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="author">
          <el-input placeholder="请输入作者" v-model="formModel.author" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="小尾巴" prop="classTail">
          <el-input placeholder="请输入小尾巴" v-model="formModel.classTail" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="formModel.remark" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider content-position="left">其它信息</el-divider>
    <el-row>
      <el-col :span="12">
        <el-form-item label="模版类型" prop="tplType">
          <el-select
            v-model="formModel.tplType"
            placeholder="请选择模版类型"
            clearable
          >
            <el-option
              v-for="dict in tpl_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="包路径" prop="packageName">
          <el-input
            placeholder="请输入包路径"
            v-model="formModel.packageName"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否启用开关按钮" prop="isSwitch">
          <el-radio-group v-model="formModel.isSwitch">
            <el-radio
              v-for="(item, index) in yes_no"
              :key="index"
              :label="item.value"
              >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="模块名" prop="moduleName">
          <el-input placeholder="请输入模块名" v-model="formModel.moduleName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开关字段" prop="switchField">
          <el-select
            v-model="formModel.switchField"
            placeholder="请选择开关字段"
            :disabled="!formModel.isSwitch"
          >
            <template v-for="dict in columns">
              <el-option
                v-if="dict.javaType == 'Boolean'"
                :key="dict.javaField"
                :label="dict.javaField"
                :value="dict.javaField"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="业务名" prop="businessName">
          <el-input
            placeholder="请输入业务名"
            v-model="formModel.businessName"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { TableReq } from "@/api/codegen/table";
import { ColumnReq } from "@/api/codegen/column";
defineOptions({ name: "GenBasicInfoTab" });

const { tpl_type, yes_no } = useDict("tpl_type", "yes_no");
const basicInfoTabRef = ref();
const props = defineProps({
  table: {
    type: Object as PropType<TableReq>,
    default: () => ({})
  },
  columns: {
    type: Array<ColumnReq>,
    default: () => []
  }
});
const formModel = ref({
  tableName: "",
  tableComment: "",
  className: "",
  author: "",
  classTail: "",
  remark: "",
  tplType: 0,
  packageName: "",
  moduleName: "",
  businessName: "",
  functionName: "",
  isSwitch: false,
  switchField: ""
});

// 自定义表单规则校验
const formRules = reactive({
  tableName: [{ required: true, message: "请输入表名称", trigger: "blur" }],
  tableComment: [{ required: true, message: "请输入表描述", trigger: "blur" }],
  className: [{ required: true, message: "请输入实体类名称", trigger: "blur" }]
});

/** 监听 table 属性，复制给 formModel 属性 */
watch(
  () => props.table,
  table => {
    if (!table) return;
    formModel.value = table;
  },
  {
    deep: true,
    immediate: true
  }
);

// 监视isSwitch属性的变化
watch(
  () => formModel.value.isSwitch,
  newIsSwitch => {
    if (!newIsSwitch) {
      // 如果isSwitch变为false，清空switchField的值
      formModel.switchField = "";
    }
  }
);

defineExpose({
  validate: async () => unref(basicInfoTabRef)?.validate()
});
</script>
