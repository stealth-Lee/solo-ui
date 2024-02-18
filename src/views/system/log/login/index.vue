<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('logLogin.column.username')" prop="title">
        <el-input
          v-model="props.queryParams.title"
          :placeholder="$t('logLogin.tip.username')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('logLogin.column.ip')" prop="method">
        <el-input
          v-model="props.queryParams.method"
          :placeholder="$t('logLogin.tip.ip')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('logLogin.column.status')" prop="type">
        <el-select
          v-model="props.queryParams.type"
          :placeholder="$t('logLogin.tip.status')"
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
      <el-form-item>
        <el-tooltip :content="$t('buttons.common.search')" placement="top">
          <el-button
            v-auth="['system-log-login-create']"
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
        <el-popconfirm
          width="180"
          icon-color="red"
          :title="$t('commons.ask.delete')"
          @confirm="handleDelete()"
        >
          <template #reference>
            <el-button
              v-auth="['system-log-login-delete']"
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
          v-auth="['system-log-login-export']"
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
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.loginId)"
            >
              <template #reference>
                <el-button
                  v-auth="['system-log-login-delete']"
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
    <LoginLogForm ref="dialogFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting } from "@/api/system/log.login";

defineOptions({ name: "SysLoginLog" });

const LoginLogForm = defineAsyncComponent(() => import("./form.vue"));
const { t } = useI18n();
const queryFormRef = ref();
const dialogFormRef = ref();

const { logger_type } = useDict("logger_type");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("logLogin.title"),
  pk: "loginId",
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
    label: t("logLogin.column.username"),
    prop: "username",
    minWidth: 120
  },
  {
    label: t("logLogin.column.ip"),
    prop: "ip",
    minWidth: 120
  },
  {
    label: t("logLogin.column.location"),
    prop: "location",
    minWidth: 120
  },
  {
    label: t("logLogin.column.deviceName"),
    prop: "deviceName",
    minWidth: 120
  },
  {
    label: t("logLogin.column.browserName"),
    prop: "browserName",
    minWidth: 120
  },
  {
    label: t("logLogin.column.status"),
    prop: "status",
    minWidth: 120
  },
  {
    label: t("logLogin.column.loginTime"),
    prop: "loginTime",
    minWidth: 120
  },
  {
    label: t("logLogin.column.remark"),
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
