<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="配置名称" prop="configName">
        <el-input
          v-model="props.queryParams.configName"
          placeholder="请输入配置名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="配置键" prop="configKey">
        <el-input
          v-model="props.queryParams.configKey"
          placeholder="请输入配置键"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="配置值" prop="configValue">
        <el-input
          v-model="props.queryParams.configValue"
          placeholder="请输入配置值"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="系统标识" prop="isSys">
        <el-select
          v-model="props.queryParams.isSys"
          placeholder="请选择系统标识"
          clearable
          class="!w-[180px]"
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
        <el-tooltip content="搜索" placement="top">
          <el-button
            :icon="useRenderIcon('ep:search')"
            :loading="props.loading"
            @click="handleQuery"
            circle
          />
        </el-tooltip>
        <el-tooltip content="重置" placement="top">
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
      :title="`${props.title}列表`"
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
          新增
        </el-button>
        <el-button
          type="success"
          :icon="useRenderIcon('ep:edit-pen')"
          @click="handleUpdate()"
          :disabled="props.single"
          plain
        >
          编辑
        </el-button>
        <el-popconfirm
          width="180"
          icon-color="red"
          title="是否删除选中数据？"
          @confirm="handleDelete()"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="useRenderIcon('ep:delete')"
              :disabled="props.multiple"
              plain
            >
              删除
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
              编辑
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              title="是否删除选中数据？"
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
                  删除
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

const { is_sys } = useDict("is_sys");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: "系统配置",
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
    label: "配置名称",
    prop: "configName",
    minWidth: 120
  },
  {
    label: "配置键",
    prop: "configKey",
    minWidth: 120
  },
  {
    label: "配置值",
    prop: "configValue",
    minWidth: 120
  },
  {
    label: "系统标识[0:否 1:是]",
    prop: "isSys",
    minWidth: 120,
    cellRenderer: scope => (
      <dict-tag options={is_sys.value} value={scope.row.isSys}></dict-tag>
    )
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 120
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 120
  },
  {
    label: "操作",
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
