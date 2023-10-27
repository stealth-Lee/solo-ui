<template>
  <div class="flex justify-between">
    <dept-tree
      ref="treeRef"
      class="min-w-[200px] mr-2"
      :treeLoading="treeLoading"
      @tree-select="handleSelectTree"
    />
    <div class="w-[calc(100%-200px)]">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input
            v-model="queryParams.mobile"
            placeholder="请输入手机号码"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
          >
            <el-option label="已开启" value="1" />
            <el-option label="已关闭" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="handleReset()">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="用户列表" :columns="columns" @refresh="handleQuery">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="handleCreateOrUpdate()"
          >
            新增
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                style="font-size: var(--el-font-size-base)"
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button type="primary" text @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
              <template #reference>
                <el-button type="danger" text class="mr-1">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            row-key="id"
            ref="tableRef"
            adaptive
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
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
                @click="handleCreateOrUpdate('编辑', row.userId)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除用户编号为${row.userId}的这条数据`"
                @confirm="handleDelete(row)"
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
                  @click="handleUpdate(row)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Upload)"
                        @click="handleUpload(row)"
                      >
                        上传头像
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Password)"
                        @click="handleReset()"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Role)"
                        @click="handleRole(row)"
                      >
                        分配角色
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
    <UserForm ref="userDialogFormRef" @refresh="getData()" />
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, reactive, defineAsyncComponent } from "vue";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUser } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { type PaginationProps } from "@pureadmin/table";

import Upload from "@iconify-icons/ri/upload-line";
import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

import { paging, deleting } from "@/api/system/user";

import DeptTree from "./tree.vue";
const UserForm = defineAsyncComponent(() => import("./form.vue"));

defineOptions({
  name: "User"
});

const { sex, status } = useDict("sex", "status");
const treeRef = ref();
const queryFormRef = ref();
const tableRef = ref();
const loading = ref(true);
const dataList = ref([]);

const userDialogFormRef = ref();

const pagination: PaginationProps = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const queryParams = reactive({
  deptId: null,
  username: null,
  mobile: null,
  status: null,
  pageNumber: pagination?.currentPage,
  pageSize: pagination?.pageSize
});

const {
  treeLoading,
  selectedNum,
  buttonClass,
  onbatchDel,
  handleUpdate,
  handleUpload,
  handleRole,
  onSelectionCancel,
  handleSelectionChange
} = useUser(tableRef, treeRef);

const columns: TableColumnList = [
  {
    label: "勾选列", // 如果需要表格多选，此处label必须设置
    type: "selection",
    fixed: "left",
    reserveSelection: true // 数据刷新后保留选项
  },
  {
    label: "用户编号",
    prop: "userId",
    width: 90
  },
  {
    label: "用户名称",
    prop: "username",
    minWidth: 130
  },
  {
    label: "用户昵称",
    prop: "nickname",
    minWidth: 130
  },
  {
    label: "用户姓名",
    prop: "name",
    minWidth: 130
  },
  {
    label: "手机号",
    prop: "mobile",
    minWidth: 130
  },
  {
    label: "性别",
    prop: "sex",
    minWidth: 90,
    cellRenderer: scope => (
      <dict-tag options={sex.value} value={scope.row.sex}></dict-tag>
    )
  },
  {
    label: "状态",
    prop: "status",
    minWidth: 90,
    cellRenderer: scope => (
      <dict-tag options={status.value} value={scope.row.status}></dict-tag>
    )
  },
  {
    label: "创建时间",
    minWidth: 90,
    prop: "createTime"
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
];

// 查询用户列表
const getData = async () => {
  loading.value = true;
  try {
    const res = await paging(queryParams);
    if (res.code === 0) {
      const data = res.data;
      dataList.value = data.records;
      pagination.total = data.totalRow;
      pagination.pageSize = data.pageSize;
    }
  } finally {
    loading.value = false;
  }
};

// 搜索按钮
const handleQuery = () => {
  getData();
};

// 部门树搜索
function handleSelectTree(row) {
  queryParams.deptId = row.deptId;
  handleQuery();
}

// 重置按钮
const handleReset = () => {
  queryParams.deptId = "";
  queryFormRef.value.resetFields();
  handleQuery();
};

// 当前页码改变事件
function handleCurrentChange(val: number) {
  queryParams.pageNumber = val;
  handleQuery();
}

// 页面大小改变事件
function handleSizeChange(val: number) {
  queryParams.pageSize = val;
  handleQuery();
}

// 新增、编辑按钮
const handleCreateOrUpdate = (title = "新增", id?: number) => {
  userDialogFormRef.value.openDialog(title, id);
};

// 删除按钮
const handleDelete = async (row: any) => {
  await deleting(row.userId);
  message(`用户[${row.username}]删除成功！`, { type: "success" });
  await getData();
};

// 初始化
onMounted(async () => {
  await getData();
});
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
