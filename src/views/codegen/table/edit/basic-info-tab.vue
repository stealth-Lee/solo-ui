<template>
  <el-form
    ref="basicInfoTabRef"
    :model="formModel"
    :rules="formRules"
    label-width="150px"
  >
    <el-divider content-position="left">{{
      t("table.message.basicInfo")
    }}</el-divider>
    <el-row>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.name')" prop="name">
          <el-input
            :placeholder="$t('table.tip.name')"
            v-model="formModel.name"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.comment')" prop="comment">
          <el-input
            :placeholder="$t('table.tip.comment')"
            v-model="formModel.comment"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.className')" prop="className">
          <el-input
            :placeholder="$t('table.tip.className')"
            v-model="formModel.className"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('table.column.functionName')"
          prop="functionName"
        >
          <el-input
            :placeholder="$t('table.tip.functionName')"
            v-model="formModel.functionName"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.author')" prop="author">
          <el-input
            :placeholder="$t('table.tip.author')"
            v-model="formModel.author"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.classTail')" prop="classTail">
          <el-input
            :placeholder="$t('table.tip.classTail')"
            v-model="formModel.classTail"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('table.column.remark')" prop="remark">
          <el-input type="textarea" :rows="3" v-model="formModel.remark" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider content-position="left">{{
      t("table.message.otherInfo")
    }}</el-divider>
    <el-row>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.tplType')" prop="tplType">
          <el-select
            v-model="formModel.tplType"
            :placeholder="$t('table.tip.tplType')"
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
        <el-form-item
          :label="$t('table.column.packageName')"
          prop="packageName"
        >
          <el-input
            v-model="formModel.packageName"
            :placeholder="$t('table.tip.packageName')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('table.column.isSwitch')" prop="isSwitch">
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
        <el-form-item :label="$t('table.column.moduleName')" prop="moduleName">
          <el-input
            :placeholder="$t('table.tip.moduleName')"
            v-model="formModel.moduleName"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('table.column.switchField')"
          prop="switchField"
        >
          <el-select
            v-model="formModel.switchField"
            :placeholder="$t('table.tip.switchField')"
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
        <el-form-item
          :label="$t('table.column.businessName')"
          prop="businessName"
        >
          <el-input
            :placeholder="$t('table.tip.businessName')"
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

const { t } = useI18n();
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
  name: "",
  comment: "",
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
  name: [
    { required: true, message: t("table.required.name"), trigger: "blur" }
  ],
  comment: [
    { required: true, message: t("table.required.comment"), trigger: "blur" }
  ],
  className: [
    { required: true, message: t("table.required.className"), trigger: "blur" }
  ]
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
      formModel.value.switchField = "";
    }
  }
);

defineExpose({
  validate: async () => unref(basicInfoTabRef)?.validate()
});
</script>
