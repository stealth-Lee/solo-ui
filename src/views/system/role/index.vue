<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="角色名称：" prop="roleName">
        <el-input
          v-model="props.queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="角色标识：" prop="roleCode">
        <el-input
          v-model="props.queryParams.roleCode"
          placeholder="请输入角色标识"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="props.queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
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
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdate(row.roleId)"
            >
              修改
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              title="是否删除选中数据？"
              @confirm="handleDelete(row.roleId)"
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
            <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Menu)"
                    >
                      菜单权限
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Database)"
                    >
                      数据权限
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
  <role-form ref="roleDialogFormRef" @refresh="loadData()" />
</template>

<script setup lang="tsx">
import { ref, reactive, computed } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { useDict } from "@/hooks/dict";
import { BasicTableProps, useTable } from "@/hooks/table";
import { paging, deleting } from "@/api/system/role";

import RoleForm from "./form.vue";

import Search from "@iconify-icons/ep/search";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import Plus from "@iconify-icons/ep/plus";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Upload from "@iconify-icons/ep/upload";
import Download from "@iconify-icons/ep/download";
import More from "@iconify-icons/ep/more-filled";
import Menu from "@iconify-icons/ep/menu";
import Database from "@iconify-icons/ri/database-2-line";

defineOptions({ name: "SysRole" });

const queryFormRef = ref();
const roleDialogFormRef = ref();

const { status } = useDict("status");

const props: BasicTableProps = reactive<BasicTableProps>({
  title: "角色",
  pk: "roleId",
  listApi: paging,
  deleteApi: deleting,
  formRef: queryFormRef,
  dialogRef: roleDialogFormRef
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
    label: "角色名称",
    prop: "roleName",
    minWidth: 120
  },
  {
    label: "角色标识",
    prop: "roleCode",
    minWidth: 150
  },
  {
    label: "状态",
    minWidth: 130,
    cellRenderer: ({ row }) => (
      <dict-tag options={status.value} value={row.status}></dict-tag>
    )
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
