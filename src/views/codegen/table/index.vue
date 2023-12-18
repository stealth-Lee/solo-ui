<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('table.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('table.tip.name')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('table.column.comment')" prop="comment">
        <el-input
          v-model="props.queryParams.comment"
          :placeholder="$t('table.tip.comment')"
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
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="listFormRef"
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
              @click="handleUpdate(row.tableId)"
            >
              {{ t("buttons.common.update") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.tableId)"
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
            <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                :size="size"
                :icon="useRenderIcon('ep:more-filled')"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('ep:menu')"
                      @click="handlePreview(row.tableId)"
                    >
                      {{ t("table.button.preview") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('ri:database-2-line')"
                      @click="handleCodegen(row.tableId)"
                    >
                      {{ t("table.button.codegen") }}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <CreateTable ref="createTableRef" @refresh="loadData()" />
    <EditTable ref="editTableRef" @refresh="loadData()" />
    <PreviewTable ref="previewTableRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting, codegen } from "@/api/codegen/table";

defineOptions({ name: "GenTable" });

const { t } = useI18n();
const { tpl_type } = useDict("tpl_type");
const CreateTable = defineAsyncComponent(() => import("./create.vue"));
const EditTable = defineAsyncComponent(() => import("./edit.vue"));
const PreviewTable = defineAsyncComponent(() => import("./preview.vue"));
const queryFormRef = ref();
const listFormRef = ref();
const createTableRef = ref();
const editTableRef = ref();
const previewTableRef = ref();

const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("table.title"),
  pk: "tableId",
  listApi: paging,
  deleteApi: deleting,
  queryRef: queryFormRef,
  listRef: listFormRef
});

const {
  loadData,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleQuery,
  handleReset,
  handleDelete
} = useTable(props);

const columns: TableColumnList = [
  {
    type: "selection",
    align: "left",
    width: 10
  },
  {
    label: t("table.column.name"),
    prop: "name",
    minWidth: 120
  },
  {
    label: t("table.column.comment"),
    prop: "comment",
    minWidth: 150
  },
  {
    label: t("table.column.author"),
    prop: "author",
    minWidth: 150
  },
  {
    label: t("table.column.tplType"),
    prop: "tplType",
    minWidth: 150,
    cellRenderer: scope => (
      <dict-tag options={tpl_type.value} value={scope.row.tplType}></dict-tag>
    )
  },
  {
    label: t("table.column.remark"),
    prop: "remark",
    minWidth: 150
  },
  {
    label: t("table.column.createTime"),
    minWidth: 180,
    prop: "createTime"
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    width: 240,
    slot: "operation"
  }
];

// 新增按钮
const handleCreate = () => {
  createTableRef.value.openDialog(`新增${props.title}`);
};

// 编辑按钮
const handleUpdate = (id?: number) => {
  editTableRef.value.openDialog(`编辑${props.title}`, id);
};

// 预览按钮
const handlePreview = (id?: number) => {
  previewTableRef.value.openDialog(id);
};

// 代码生成
const handleCodegen = (id?: number) => {
  codegen(id);
};

const buttonClass = computed(() => {
  return [
    "!h-[20px]",
    "reset-margin",
    "!text-gray-500",
    "dark:!text-white",
    "dark:hover:!text-primary"
  ];
});
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
