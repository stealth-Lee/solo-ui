<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('onlineUser.column.nickname')" prop="nickname">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('onlineUser.tip.nickname')"
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
          :title="$t('onlineUser.ask.offline')"
          @confirm="handleDelete()"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="useRenderIcon('ep:delete')"
              :disabled="props.multiple"
              plain
            >
              {{ t("onlineUser.button.offline") }}
            </el-button>
          </template>
        </el-popconfirm>
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
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('onlineUser.ask.offline')"
              @confirm="handleDelete(row.userId)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon('ep:delete')"
                >
                  {{ t("onlineUser.button.offline") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { offline, paging } from "@/api/system/online.user";

defineOptions({ name: "SysOnlineUser" });

const queryFormRef = ref();
const { t } = useI18n();
const { is_sys } = useDict("is_sys");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("onlineUser.title"),
  pk: "configId",
  listApi: paging,
  deleteApi: offline,
  queryRef: queryFormRef
});

const {
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleQuery,
  handleReset,
  handleDelete,
} = useTable(props);

const columns: TableColumnList = [
  {
    type: "selection",
    align: "left",
    width: 10
  },
  {
    label: t("onlineUser.column.userId"),
    prop: "userId",
    minWidth: 120
  },
  {
    label: t("onlineUser.column.nickname"),
    prop: "nickname",
    minWidth: 120
  },
  {
    label: t("onlineUser.column.value"),
    prop: "value",
    minWidth: 120
  },
  {
    label: t("onlineUser.column.isSys"),
    prop: "isSys",
    minWidth: 120,
    cellRenderer: scope => (
      <dict-tag options={is_sys.value} value={scope.row.isSys}></dict-tag>
    )
  },
  {
    label: t("onlineUser.column.createTime"),
    prop: "createTime",
    minWidth: 120
  },
  {
    label: t("onlineUser.column.remark"),
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
