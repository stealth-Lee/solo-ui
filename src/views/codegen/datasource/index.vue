<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('datasource.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('datasource.tip.name')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-tooltip :content="$t('buttons.common.search')" placement="top">
          <el-button
            :icon="useRenderIcon(Search)"
            :loading="props.loading"
            @click="handleQuery"
            circle
          />
        </el-tooltip>
        <el-tooltip :content="$t('buttons.common.reset')" placement="top">
          <el-button
            :icon="useRenderIcon(RefreshRight)"
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
          :icon="useRenderIcon(Plus)"
          @click="handleCreate()"
          plain
        >
          {{ t("buttons.common.create") }}
        </el-button>
        <el-button
          type="success"
          :icon="useRenderIcon(EditPen)"
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
              :icon="useRenderIcon(Delete)"
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
              type="success"
              :size="size"
              :icon="useRenderIcon(Database)"
              @click="handleTest(row.sourceId)"
            >
              {{ t("datasource.button.connect") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdate(row.sourceId)"
            >
              {{ t("buttons.common.update") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.sourceId)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  {{ t("buttons.common.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <DatasourceForm ref="datasourceFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useMessage } from "@/hooks/message";
import { BasicTableProps, useTable } from "@/hooks/table";
import { paging, deleting, test } from "@/api/codegen/datasource";

import DatasourceForm from "./form.vue";

import Search from "@iconify-icons/ep/search";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import Plus from "@iconify-icons/ep/plus";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Upload from "@iconify-icons/ep/upload";
import Download from "@iconify-icons/ep/download";
import Database from "@iconify-icons/ri/database-2-line";

defineOptions({ name: "SysRole" });

const { t } = useI18n();
const message = useMessage();
const queryFormRef = ref();
const datasourceFormRef = ref();

const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("datasource.title"),
  pk: "sourceId",
  listApi: paging,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: datasourceFormRef
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
    label: t("datasource.column.name"),
    prop: "name"
  },
  {
    label: t("datasource.column.url"),
    prop: "url"
  },
  {
    label: t("datasource.column.username"),
    prop: "username"
  },
  {
    label: t("datasource.column.remark"),
    prop: "remark"
  },
  {
    label: t("datasource.column.createTime"),
    prop: "createTime"
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    slot: "operation",
    minWidth: 150
  }
];

const handleTest = async (id: number) => {
  await test(id);
  message.success(t("datasource.message.connect"));
};
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
