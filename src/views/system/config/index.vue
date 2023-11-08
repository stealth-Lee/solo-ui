<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('config.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('config.tip.name')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('config.column.key')" prop="key">
        <el-input
          v-model="props.queryParams.key"
          :placeholder="$t('config.tip.key')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('config.column.value')" prop="value">
        <el-input
          v-model="props.queryParams.value"
          :placeholder="$t('config.tip.value')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('config.column.isSys')" prop="isSys">
        <el-select
          v-model="props.queryParams.isSys"
          :placeholder="$t('config.tip.isSys')"
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="dict in is_sys"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-tooltip :content="$t('commons.buttons.search')" placement="top">
          <el-button
            :icon="useRenderIcon('ep:search')"
            :loading="props.loading"
            @click="handleQuery"
            circle
          />
        </el-tooltip>
        <el-tooltip :content="$t('commons.buttons.reset')" placement="top">
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
      :title="`${props.title}${t('commons.other.list')}`"
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
          {{ t("commons.buttons.create") }}
        </el-button>
        <el-button
          type="success"
          :icon="useRenderIcon('ep:edit-pen')"
          @click="handleUpdate()"
          :disabled="props.single"
          plain
        >
          {{ t("commons.buttons.edit") }}
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
              {{ t("commons.buttons.delete") }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-button
          type="info"
          :icon="useRenderIcon('ep:upload')"
          @click="handleUpdate()"
          plain
        >
          导入
        </el-button>
        <el-button
          type="warning"
          :icon="useRenderIcon('ep:download')"
          @click="handleUpdate()"
          plain
        >
          导出
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
              @click="handleUpdate(row.configId)"
            >
              {{ t("commons.buttons.edit") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.configId)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon('ep:delete')"
                >
                  {{ t("commons.buttons.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <ConfigForm ref="configFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting } from "@/api/system/config";

defineOptions({ name: "SysConfig" });

const ConfigForm = defineAsyncComponent(() => import("./form.vue"));
const queryFormRef = ref();
const configFormRef = ref();
const { t } = useI18n();
const { is_sys } = useDict("is_sys");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("config.title"),
  pk: "configId",
  listApi: paging,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: configFormRef
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
  handleDelete
} = useTable(props);

const columns: TableColumnList = [
  {
    type: "selection",
    align: "left",
    width: 10
  },
  {
    label: t("config.column.name"),
    prop: "name",
    minWidth: 120
  },
  {
    label: t("config.column.key"),
    prop: "key",
    minWidth: 120
  },
  {
    label: t("config.column.value"),
    prop: "value",
    minWidth: 120
  },
  {
    label: t("config.column.isSys"),
    prop: "isSys",
    minWidth: 120,
    cellRenderer: scope => (
      <dict-tag options={is_sys.value} value={scope.row.isSys}></dict-tag>
    )
  },
  {
    label: t("config.column.createTime"),
    prop: "createTime",
    minWidth: 120
  },
  {
    label: t("config.column.remark"),
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
