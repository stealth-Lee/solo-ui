<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('dictData.column.value')" prop="value">
        <el-input
          v-model="props.queryParams.value"
          :placeholder="$t('dictData.tip.value')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.label')" prop="label">
        <el-input
          v-model="props.queryParams.label"
          :placeholder="$t('dictData.tip.label')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('dictData.column.status')" prop="status">
        <el-select
          v-model="props.queryParams.status"
          :placeholder="$t('dictData.tip.status')"
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="dict in status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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

    <!-- 列表 -->
    <PureTableBar
      :title="`${props.title}${t('commons.other.list')}(${route.params.code})`"
      :columns="columns"
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
        <el-button
          type="success"
          :icon="useRenderIcon('ep:edit-pen')"
          @click="handleUpdate()"
          :disabled="props.single"
          plain
        >
          {{ t("buttons.common.edit") }}
        </el-button>
        <el-popconfirm
          width="180"
          icon-color="red"
          :title="$t('commons.ask.delete')"
          @confirm="handleDelete()"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="useRenderIcon('ep:delete')"
              :disabled="props.multiple"
              plain
            >
              {{ t("buttons.common.delete") }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-button
          type="info"
          :icon="useRenderIcon('ep:upload')"
          @click="handleUpdate()"
          plain
        >
          {{ t("buttons.common.import") }}
        </el-button>
        <el-button
          type="warning"
          :icon="useRenderIcon('ep:download')"
          @click="handleUpdate()"
          plain
        >
          {{ t("buttons.common.export") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="props.loading"
          :size="size"
          adaptive
          :data="props.dataList"
          :columns="dynamicColumns"
          :pagination="props.pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ep:edit-pen')"
              @click="handleUpdate(row.dataId)"
            >
              {{ t("buttons.common.update") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.dataId)"
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
    <DictDataForm ref="dictDataFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { isNullOrUnDef } from "@pureadmin/utils";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting, updateStatus } from "@/api/system/dict.data";

defineOptions({ name: "SysDictData" });

const { t } = useI18n();
const route = useRoute(); // 路由
const DictDataForm = defineAsyncComponent(() => import("./form.vue"));
const queryFormRef = ref();
const dictDataFormRef = ref();
const { status } = useDict("status");
const props: BasicTableProps = reactive<BasicTableProps>({
  queryParams: {
    code: route.params.code,
    value: "",
    label: "",
    status: ""
  },
  title: t("dictData.title"),
  pk: "dataId",
  listApi: paging,
  deleteApi: deleting,
  switchApi: updateStatus,
  switchField: "status",
  queryRef: queryFormRef,
  formRef: dictDataFormRef
});

const {
  loadData,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleQuery,
  handleReset,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSwitch
} = useTable(props);

const columns: TableColumnList = [
  {
    type: "selection",
    align: "left",
    width: 10
  },
  {
    label: t("dictData.column.value"),
    prop: "value",
    minWidth: 120
  },
  {
    label: t("dictData.column.label"),
    prop: "label",
    minWidth: 120,
    cellRenderer: scope =>
      isNullOrUnDef(scope.row.tagType) || scope.row.tagType === "default" ? (
        <span>{scope.row.label}</span>
      ) : (
        <el-tag type={scope.row.tagType === "primary" ? "" : scope.row.tagType}>
          {scope.row.label}
        </el-tag>
      )
  },
  {
    label: t("dictData.column.dictSort"),
    prop: "dictSort",
    minWidth: 120
  },
  {
    label: t("dictData.column.status"),
    prop: "status",
    minWidth: 120,
    cellRenderer: scope => (
      <el-switch
        v-model={scope.row.status}
        active-value={1}
        inactive-value={0}
        onChange={() => handleSwitch(scope.row)}
      />
    )
  },
  {
    label: t("dictData.column.createTime"),
    prop: "createTime",
    minWidth: 120
  },
  {
    label: t("dictData.column.remark"),
    prop: "remark",
    minWidth: 120
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    width: 240,
    slot: "operation"
  }
];
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
