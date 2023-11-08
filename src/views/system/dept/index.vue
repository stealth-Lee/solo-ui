<template>
  <div class="main">
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('dept.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('dept.tip.name')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('dept.column.code')" prop="code">
        <el-input
          v-model="props.queryParams.code"
          :placeholder="$t('dept.tip.code')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item>
        <el-tooltip :content="$t('buttons.common.search')" placement="top">
          <el-button
            :icon="useRenderIcon('ep:search')"
            :loading="props.loading"
            @click="handleQuery"
            circle
          />
        </el-tooltip>
        <el-tooltip :content="$t('buttons.common.reset')" placement="top">
          <el-button
            :icon="useRenderIcon('ep:refresh-right')"
            @click="handleReset()"
            circle
          />
        </el-tooltip>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="部门列表"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="handleQuery"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon('ep:plus')"
          @click="handleCreate()"
          plain
        >
          {{ t("buttons.common.create") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 32 }"
          align-whole="center"
          row-key="deptId"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="props.loading"
          :size="size"
          :data="props.dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ep:edit-pen')"
              @click="handleUpdate(row.deptId)"
            >
              {{ t("buttons.common.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.deptId)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon('ep:delete')"
                >
                  {{ t("buttons.common.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <DeptForm ref="deptFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { deleting, listing } from "@/api/system/dept";

const DeptForm = defineAsyncComponent(() => import("./form.vue"));
const { t } = useI18n();
const queryFormRef = ref();
const deptFormRef = ref();
const tableRef = ref();

defineOptions({
  name: "Dept"
});

const props: BasicTableProps = reactive<BasicTableProps>({
  type: "tree",
  title: t("dept.title"),
  pk: "deptId",
  listApi: listing,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: deptFormRef
});

const {
  loadData,
  handleQuery,
  handleReset,
  handleCreate,
  handleUpdate,
  handleDelete
} = useTable(props);

const columns: TableColumnList = [
  {
    label: t("dept.column.name"),
    prop: "name",
    width: 180,
    align: "left"
  },
  {
    label: t("dept.column.code"),
    prop: "code",
    width: 180,
    align: "left"
  },
  {
    label: t("dept.column.sort"),
    prop: "sort",
    minWidth: 70
  },
  {
    label: t("dept.column.createTime"),
    minWidth: 200,
    prop: "createTime"
  },
  {
    label: t("dept.column.remark"),
    prop: "remark",
    minWidth: 320
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    width: 160,
    slot: "operation"
  }
];
</script>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
