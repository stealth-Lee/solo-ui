<template>
  <pure-table :data="dataList" :columns="tableColumns" alignWhole="center" />
</template>

<script setup lang="tsx">
import {
  DictTypeReq,
  listSimple as dictlistSimple
} from "@/api/system/dict.type";

defineOptions({ name: "GenColumnInfoTab" });

const dictList = ref<DictTypeReq[]>([]);
const { java_type, query_mode, form_type } = useDict(
  "java_type",
  "query_mode",
  "form_type"
);
const basicEntity: string[] = [
  "create_by",
  "create_time",
  "update_by",
  "update_time",
  "deleted"
];
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
        width: 130,
        align: "left",
        headerAlign: "center"
      },
      {
        label: "列类型",
        prop: "columnType",
        width: 150,
        align: "left",
        headerAlign: "center"
      },
      {
        label: "Java字段名",
        prop: "javaField",
        width: 130,
        cellRenderer: scope => (
          <el-input
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.javaField}
          />
        )
      },
      {
        label: "Java类型",
        prop: "javaType",
        width: 150,
        cellRenderer: scope => (
          <el-select
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.javaType}
          >
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
        width: 150,
        cellRenderer: scope => (
          <el-input
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.javaComment}
          />
        )
      },
      {
        label: "主键",
        prop: "isPk",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.isPk}
          />
        )
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
        cellRenderer: scope => (
          <el-checkbox
            disabled={scope.row.columnName == "deleted"}
            v-model={scope.row.isList}
          />
        )
      },
      {
        label: "查询",
        prop: "isQuery",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={scope.row.columnName == "deleted"}
            v-model={scope.row.isQuery}
          />
        )
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
        cellRenderer: scope => (
          <el-checkbox
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.isCreate}
          />
        )
      },
      {
        label: "更新",
        prop: "isUpdate",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.isUpdate}
          />
        )
      },
      {
        label: "必填",
        prop: "isRequired",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.isRequired}
          />
        )
      },
      {
        label: "表单类型",
        prop: "formType",
        width: 130,
        cellRenderer: scope => (
          <el-select
            disabled={basicEntity.includes(scope.row.columnName)}
            v-model={scope.row.formType}
            class="!w-[100px]"
          >
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
        prop: "dictCode",
        width: 180,
        cellRenderer: scope => (
          <el-select
            v-model={scope.row.dictCode}
            disabled={basicEntity.includes(scope.row.columnName)}
            filterable
            allow-create
          >
            {dictList.value.map(item => (
              <el-option
                key={item.dictCode}
                label={item.dictCode}
                value={item.dictCode}
              >
                <span style="float: left">{item.dictCode}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                >
                  {item.dictName}
                </span>
              </el-option>
            ))}
          </el-select>
        )
      }
    ]
  }
];

watch(
  () => props.columns,
  columns => {
    if (!columns) return;
    dataList.value = columns;
  },
  {
    deep: true,
    immediate: true
  }
);

onMounted(async () => {
  const res = await dictlistSimple();
  dictList.value = res.data;
});
</script>
<style>
.el-drawer__body {
  overflow: auto;
}
</style>
