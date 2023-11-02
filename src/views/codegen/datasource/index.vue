<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="别名" prop="name">
        <el-input
          v-model="props.queryParams.name"
          placeholder="请输入别名："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-tooltip content="搜索" placement="top">
          <el-button
            :icon="useRenderIcon(Search)"
            :loading="props.loading"
            @click="handleQuery"
            circle
          />
        </el-tooltip>
        <el-tooltip content="重置" placement="top">
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
      :title="`${props.title}列表`"
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
          新增
        </el-button>
        <el-button
          type="success"
          :icon="useRenderIcon(EditPen)"
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
              :icon="useRenderIcon(Delete)"
              :disabled="props.multiple"
              plain
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
        <el-button
          type="info"
          :icon="useRenderIcon(Upload)"
          @click="handleUpdate()"
          plain
        >
          导入
        </el-button>
        <el-button
          type="warning"
          :icon="useRenderIcon(Download)"
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
              type="success"
              :size="size"
              :icon="useRenderIcon(Database)"
              @click="handleTest(row.sourceId)"
            >
              测试连接
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdate(row.sourceId)"
            >
              修改
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              title="是否删除选中数据？"
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
                  删除
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

const message = useMessage();
const queryFormRef = ref();
const datasourceFormRef = ref();

const props: BasicTableProps = reactive<BasicTableProps>({
  title: "数据源",
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
    label: "连接名",
    prop: "name",
    minWidth: 120
  },
  {
    label: "数据源URL",
    prop: "url",
    minWidth: 150
  },
  {
    label: "用户名",
    prop: "username",
    minWidth: 150
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 150
  },
  {
    label: "创建时间",
    minWidth: 180,
    prop: "createTime"
  },
  {
    label: "操作",
    fixed: "right",
    width: 240,
    slot: "operation"
  }
];

const handleTest = async (id: number) => {
  await test(id);
  message.success("连接成功");
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
