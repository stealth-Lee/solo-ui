<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('menu.column.type')" prop="type">
        <el-input
          v-model="props.queryParams.type"
          :placeholder="$t('menu.tip.type')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('menu.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('menu.tip.name')"
          clearable
          class="!w-[180px]"
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
          ref="tableRef"
          row-key="menuId"
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
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ep:edit-pen')"
              @click="handleUpdate(row.menuId)"
            >
              {{ t("buttons.common.edit") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.menuId)"
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
    <MenuForm ref="dialogFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { listing, deleting } from "@/api/system/menu";

defineOptions({ name: "SysMenu" });

const MenuForm = defineAsyncComponent(() => import("./form.vue"));
const { t } = useI18n();
const queryFormRef = ref();
const dialogFormRef = ref();
const tableRef = ref();
const { menu_type } = useDict("menu_type");
const props: BasicTableProps = reactive<BasicTableProps>({
  type: "tree",
  title: t("menu.title"),
  pk: "menuId",
  listApi: listing,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: dialogFormRef
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
    label: t("menu.column.name"),
    prop: "name",
    minWidth: 120
  },
  {
    label: t("menu.column.icon"),
    prop: "icon",
    minWidth: 120,
    cellRenderer: scope => <i class="ep:delete" />
  },
  {
    label: t("menu.column.type"),
    prop: "type",
    minWidth: 120,
    cellRenderer: scope => (
      <dict-tag options={menu_type.value} value={scope.row.type}></dict-tag>
    )
  },
  {
    label: t("menu.column.sort"),
    prop: "sort",
    minWidth: 120
  },
  {
    label: t("menu.column.path"),
    prop: "path",
    minWidth: 120
  },
  {
    label: t("menu.column.permission"),
    prop: "permission",
    minWidth: 120
  },
  {
    label: t("menu.column.createTime"),
    prop: "createTime",
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
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
