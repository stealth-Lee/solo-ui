<template>
  <div class="main">
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('dept.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          placeholder="请输入部门名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="props.queryParams.code"
          placeholder="请输入部门编码"
          clearable
          class="!w-[200px]"
        />
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

    <PureTableBar
      title="部门列表"
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
          新增
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 32 }"
          align-whole="center"
          row-key="deptId"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="props.loading"
          :size="size"
          :data="props.dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ep:edit-pen')"
              @click="handleUpdate(row.deptId)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="是否删除选中数据？"
              @confirm="handleDelete(row.deptId)"
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
    <DeptForm ref="deptFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { deleting, listing } from "@/api/system/dept";

const DeptForm = defineAsyncComponent(() => import("./form.vue"));

const queryFormRef = ref();
const deptFormRef = ref();
const tableRef = ref();

defineOptions({
  name: "Dept"
});

const props: BasicTableProps = reactive<BasicTableProps>({
  type: "tree",
  title: "部门",
  pk: "deptId",
  listApi: listing,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: deptFormRef
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
    label: "部门名称",
    prop: "name",
    width: 180,
    align: "left"
  },
  {
    label: "部门编码",
    prop: "code",
    width: 180,
    align: "left"
  },
  {
    label: "排序",
    prop: "sort",
    minWidth: 70
  },
  {
    label: "创建时间",
    minWidth: 200,
    prop: "createTime"
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 320
  },
  {
    label: "操作",
    fixed: "right",
    width: 160,
    slot: "operation"
  }
];
</script>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
