<template>
  <pure-table
    :data="dataList"
    :columns="tableColumns"
    alignWhole="center"
    max-height="470"
  />
</template>

<script setup lang="tsx">
import { TableReq } from "@/api/codegen/table";
import { ColumnReq } from "@/api/codegen/column";
import {
  DictTypeReq,
  listSimple as dictlistSimple
} from "@/api/system/dict.type";

defineOptions({ name: "GenColumnInfoTab" });

const { t } = useI18n();
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
const dataList = ref([]);
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

const tableColumns: TableColumnList = [
  {
    label: t("genColumn.column.field"),
    children: [
      {
        label: t("genColumn.column.name"),
        prop: "name",
        width: 130,
        align: "left",
        headerAlign: "center"
      },
      {
        label: t("genColumn.column.type"),
        prop: "type",
        width: 150,
        align: "left",
        headerAlign: "center"
      },
      {
        label: t("genColumn.column.javaField"),
        prop: "javaField",
        width: 130,
        cellRenderer: scope => (
          <el-input
            disabled={
              basicEntity.includes(scope.row.name) ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
            v-model={scope.row.javaField}
          />
        )
      },
      {
        label: t("genColumn.column.javaType"),
        prop: "javaType",
        width: 150,
        cellRenderer: scope => (
          <el-select
            disabled={
              basicEntity.includes(scope.row.name) ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
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
        label: t("genColumn.column.javaComment"),
        prop: "javaComment",
        width: 150,
        cellRenderer: scope => (
          <el-input
            disabled={basicEntity.includes(scope.row.name)}
            v-model={scope.row.javaComment}
          />
        )
      },
      {
        label: t("genColumn.column.isPk"),
        prop: "isPk",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={basicEntity.includes(scope.row.name)}
            v-model={scope.row.isPk}
          />
        )
      }
    ]
  },
  {
    label: t("genColumn.column.list"),
    children: [
      {
        label: t("genColumn.column.isList"),
        prop: "isList",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={
              scope.row.name == "deleted" ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
            v-model={scope.row.isList}
          />
        )
      },
      {
        label: t("genColumn.column.isQuery"),
        prop: "isQuery",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={scope.row.name == "deleted"}
            v-model={scope.row.isQuery}
          />
        )
      },
      {
        label: t("genColumn.column.queryMode"),
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
    label: t("genColumn.column.form"),
    children: [
      {
        label: t("genColumn.column.isCreate"),
        prop: "isCreate",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={
              basicEntity.includes(scope.row.name) ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
            v-model={scope.row.isCreate}
          />
        )
      },
      {
        label: t("genColumn.column.isUpdate"),
        prop: "isUpdate",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={
              basicEntity.includes(scope.row.name) ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
            v-model={scope.row.isUpdate}
          />
        )
      },
      {
        label: t("genColumn.column.isRequired"),
        prop: "isRequired",
        width: 55,
        cellRenderer: scope => (
          <el-checkbox
            disabled={
              basicEntity.includes(scope.row.name) ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
            v-model={scope.row.isRequired}
          />
        )
      },
      {
        label: t("genColumn.column.formType"),
        prop: "formType",
        width: 130,
        cellRenderer: scope => (
          <el-select
            disabled={basicEntity.includes(scope.row.name)}
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
      // TODO 11 修改成当isSwitch=true时，自动将字典设置成status
      {
        label: t("genColumn.column.dictCode"),
        prop: "dictCode",
        width: 180,
        cellRenderer: scope => (
          <el-select
            v-model={scope.row.dictCode}
            disabled={
              basicEntity.includes(scope.row.name) ||
              (props.table.isSwitch &&
                props.table.switchField == scope.row.javaField)
            }
            filterable
            allow-create
          >
            {dictList.value.map(item => (
              <el-option key={item.code} label={item.code} value={item.code}>
                <span style="float: left">{item.code}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                >
                  {item.name}
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
