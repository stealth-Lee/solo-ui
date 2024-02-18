<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('logOperate.column.title')" prop="title">
        <el-input
          v-model="props.queryParams.title"
          :placeholder="$t('logOperate.tip.title')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('logOperate.column.type')" prop="type">
        <el-select
          v-model="props.queryParams.type"
          :placeholder="$t('logOperate.tip.type')"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="dict in logger_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('logOperate.column.method')" prop="method">
        <el-input
          v-model="props.queryParams.method"
          :placeholder="$t('logOperate.tip.method')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item
        :label="$t('logOperate.column.createTime')"
        prop="createTime"
      >
        <el-date-picker
          v-model="props.queryParams.createTime"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="$t('tip.rangeSeparator')"
          :start-placeholder="$t('tip.time.start')"
          :end-placeholder="$t('tip.time.end')"
        />
      </el-form-item>
      <el-form-item>
        <el-tooltip :content="$t('buttons.common.search')" placement="top">
          <el-button
            v-auth="['system-operate-log-create']"
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
          v-auth="['system-operate-log-create']"
        >
          {{ t("buttons.common.create") }}
        </el-button>
        <el-button
          type="success"
          :icon="useRenderIcon('ep:edit-pen')"
          @click="handleUpdate()"
          :disabled="props.single"
          plain
          v-auth="['system-operate-log-update']"
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
              v-auth="['system-operate-log-delete']"
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
          v-auth="['system-operate-log-import']"
          type="info"
          :icon="useRenderIcon('ep:upload')"
          @click="handleUpdate()"
          plain
        >
          {{ t("buttons.common.import") }}
        </el-button>
        <el-button
          v-auth="['system-operate-log-export']"
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
          table-layout="auto"
          :data="props.dataList"
          :columns="dynamicColumns"
          :loading="props.loading"
          :size="size"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          showOverflowTooltip
          adaptive
          :pagination="props.pagination"
          :paginationSmall="size === 'small' ? true : false"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-auth="['system-operate-log-update']"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ep:edit-pen')"
              @click="handleUpdate(row.operateId)"
            >
              {{ t("buttons.common.edit") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.operateId)"
            >
              <template #reference>
                <el-button
                  v-auth="['system-operate-log-delete']"
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
    <logOperateForm ref="dialogFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting } from "@/api/system/log.operate";

defineOptions({ name: "SyslogOperate" });

const logOperateForm = defineAsyncComponent(() => import("./form.vue"));
const { t } = useI18n();
const queryFormRef = ref();
const dialogFormRef = ref();

const { logger_type } = useDict("logger_type");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("logOperate.title"),
  pk: "operateId",
  listApi: paging,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: dialogFormRef
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
    label: t("logOperate.column.title"),
    prop: "title",
    minWidth: 120
  },
  {
    label: t("logOperate.column.type"),
    prop: "type",
    minWidth: 120,
    cellRenderer: scope => (
      <dict-tag options={logger_type.value} value={scope.row.type}></dict-tag>
    )
  },
  {
    label: t("logOperate.column.method"),
    prop: "method",
    minWidth: 120
  },
  {
    label: t("logOperate.column.requestUrl"),
    prop: "requestUrl",
    minWidth: 120
  },
  {
    label: t("logOperate.column.requestMethod"),
    prop: "requestMethod",
    minWidth: 120
  },
  {
    label: t("logOperate.column.userIp"),
    prop: "userIp",
    minWidth: 120
  },
  {
    label: t("logOperate.column.deviceName"),
    prop: "deviceName",
    minWidth: 120
  },
  {
    label: t("logOperate.column.browserName"),
    prop: "browserName",
    minWidth: 120
  },
  {
    label: t("logOperate.column.executionTime"),
    prop: "executionTime",
    minWidth: 120
  },
  {
    label: t("logOperate.column.createTime"),
    prop: "createTime",
    minWidth: 120
  },
  {
    label: t("logOperate.column.remark"),
    prop: "remark",
    minWidth: 120
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
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
