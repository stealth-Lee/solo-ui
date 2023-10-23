<template>
  <pure-table :data="dataList" :columns="tableColumns" alignWhole="center" />
</template>

<script setup lang="tsx">
defineOptions({ name: "GenColumnInfoTab" });

const { java_type, query_mode, form_type } = useDict(
  "java_type",
  "query_mode",
  "form_type"
);

const props = defineProps({
  columns: {
    type: Array,
    default: () => null
  }
});
const dataList = ref([]);
const tableColumns: TableColumnList = [
  {
    label: "字段",
    prop: "date",
    children: [
      {
        label: "列名",
        prop: "columnName",
        headerAlign: "center",
        align: "left"
      },
      {
        label: "列类型",
        prop: "columnType",
        headerAlign: "center",
        width: 120,
        align: "left"
      },
      {
        label: "Java字段名",
        prop: "javaField",
        width: 130,
        cellRenderer: scope => <el-input v-model={scope.row.javaField} />
      },
      {
        label: "Java类型",
        prop: "javaType",
        width: 130,
        cellRenderer: scope => (
          <el-select v-model={scope.row.javaType} class="!w-[100px]">
            {java_type.value.map(item => (
              <el-option
                key={item.value}
                label={item.value}
                value={item.value}
              />
            ))}
          </el-select>
        )
      },
      {
        label: "Java说明",
        prop: "javaComment",
        width: 130,
        cellRenderer: scope => <el-input v-model={scope.row.javaComment} />
      },
      {
        label: "主键",
        prop: "isPk",
        width: 55,
        cellRenderer: scope => <el-checkbox v-model={scope.row.isPk} />
      }
    ]
  },
  {
    label: "列表",
    prop: "name",
    children: [
      {
        label: "列表",
        prop: "isList",
        width: 55,
        cellRenderer: scope => <el-checkbox v-model={scope.row.isList} />
      },
      {
        label: "查询",
        prop: "isQuery",
        width: 55,
        cellRenderer: scope => <el-checkbox v-model={scope.row.isQuery} />
      },
      {
        label: "查询方式",
        prop: "queryMode",
        width: 130,
        cellRenderer: scope => (
          <el-select
            v-model={scope.row.queryMode}
            disabled={!scope.row.isQuery}
            class="!w-[100px]"
          >
            {query_mode.value.map(item => (
              <el-option
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </el-select>
        )
      }
    ]
  },
  {
    label: "表单",
    prop: "post-code",
    children: [
      {
        label: "插入",
        prop: "isCreate",
        width: 55,
        cellRenderer: scope => <el-checkbox v-model={scope.row.isCreate} />
      },
      {
        label: "更新",
        prop: "isUpdate",
        width: 55,
        cellRenderer: scope => <el-checkbox v-model={scope.row.isUpdate} />
      },
      {
        label: "必填",
        prop: "isRequired",
        width: 55,
        cellRenderer: scope => <el-checkbox v-model={scope.row.isRequired} />
      },
      {
        label: "表单类型",
        prop: "formType",
        width: 130,
        cellRenderer: scope => (
          <el-select v-model={scope.row.formType} class="!w-[100px]">
            {form_type.value.map(item => (
              <el-option
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </el-select>
        )
      },
      {
        label: "字典",
        prop: "dictCode"
      }
    ]
  }
];

watch(
  () => props.columns,
  columns => {
    console.log(columns)
    if (!columns) return;
    dataList.value = columns;
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
<style>
.el-drawer__body {
  overflow: auto;
}
</style>
