<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('dictType.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('dictType.tip.name')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('dictType.column.code')" prop="code">
        <el-input
          v-model="props.queryParams.code"
          :placeholder="$t('dictType.tip.code')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('dictType.column.type')" prop="type">
        <el-select
          v-model="props.queryParams.type"
          :placeholder="$t('dictType.tip.type')"
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="dict in dict_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dictType.column.status')" prop="status">
        <el-select
          v-model="props.queryParams.status"
          :placeholder="$t('dictType.tip.status')"
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
          {{ t("commons.buttons.import") }}
        </el-button>
        <el-button
          type="warning"
          :icon="useRenderIcon('ep:download')"
          @click="handleUpdate()"
          plain
        >
          {{ t("commons.buttons.export") }}
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
              @click="handleUpdate(row.typeId)"
            >
              {{ t("commons.buttons.update") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.typeId)"
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
    <DictTypeForm ref="dictTypeFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting, updateStatus } from "@/api/system/dict.type";

defineOptions({ name: "SysDictType" });

const { t } = useI18n();
const DictTypeForm = defineAsyncComponent(() => import("./form.vue"));
const queryFormRef = ref();
const dictTypeFormRef = ref();
const { dict_type, status } = useDict("dict_type", "status");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("dictType.title"),
  pk: "typeId",
  listApi: paging,
  deleteApi: deleting,
  switchApi: updateStatus,
  switchField: "status",
  queryRef: queryFormRef,
  formRef: dictTypeFormRef
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
    label: t("dictType.column.name"),
    prop: "name",
    minWidth: 120
  },
  {
    label: t("dictType.column.code"),
    prop: "code",
    minWidth: 120,
    cellRenderer: scope => (
      <router-link to={"/system/dict/data/" + scope.row.code}>
        <el-button link type="primary">
          {scope.row.code}
        </el-button>
      </router-link>
    )
  },
  {
    label: t("dictType.column.type"),
    prop: "type",
    minWidth: 120,
    cellRenderer: scope => (
      <dict-tag options={dict_type.value} value={scope.row.type}></dict-tag>
    )
  },
  {
    label: t("dictType.column.status"),
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
    label: t("dictType.column.createTime"),
    prop: "createTime",
    minWidth: 120
  },
  {
    label: t("dictType.column.remark"),
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
