<template>
  <div class="flex justify-between">
    <dept-tree
      ref="treeRef"
      class="min-w-[200px] mr-2"
      @tree-select="handleSelectTree"
    />
    <div class="w-[calc(100%-200px)]">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="props.queryParams"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item :label="$t('user.column.username')" prop="username">
          <el-input
            v-model="props.queryParams.username"
            :placeholder="$t('user.tip.username')"
            clearable
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item :label="$t('user.column.mobile')" prop="mobile">
          <el-input
            v-model="props.queryParams.mobile"
            :placeholder="$t('user.tip.mobile')"
            clearable
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item :label="$t('user.column.status')" prop="status">
          <el-select
            v-model="props.queryParams.status"
            :placeholder="$t('user.tip.status')"
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
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            row-key="userId"
            align-whole="center"
            table-layout="auto"
            :loading="props.loading"
            :data="props.dataList"
            :pagination="props.pagination"
            :size="size"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
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
                @click="handleUpdate(row.userId)"
              >
                {{ t("buttons.common.update") }}
              </el-button>
              <el-popconfirm
                :title="$t('commons.ask.delete')"
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
                        :icon="useRenderIcon('ri:upload-line')"
                        @click="handleReset()"
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
                        :icon="useRenderIcon('ri:lock-password-line')"
                        @click="resetPassword(row.userId)"
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
                        :icon="useRenderIcon('ri:admin-line')"
                        @click="handleReset()"
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
    <UserForm ref="userFormRef" @refresh="loadData()" />
    <Password ref="passwordFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { BasicTableProps } from "@/hooks/table";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { paging, deleting } from "@/api/system/user";

import DeptTree from "./tree.vue";
const UserForm = defineAsyncComponent(() => import("./form.vue"));
const Password = defineAsyncComponent(() => import("./password.vue"));

defineOptions({
  name: "User"
});

const { t } = useI18n();
const { sex, status } = useDict("sex", "status");
const treeRef = ref();
const queryFormRef = ref();
const userFormRef = ref();
const passwordFormRef = ref();

const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("user.title"),
  pk: "userId",
  listApi: paging,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: userFormRef
});

const {
  loadData,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleQuery,
  handleCreate,
  handleUpdate,
  handleDelete
} = useTable(props);

const columns: TableColumnList = [
  {
    type: "selection",
    align: "left",
    width: 40,
    reserveSelection: true // 数据刷新后保留选项,此功能需指定row-key
  },
  {
    label: "#",
    type: "index",
    width: 40
  },
  {
    label: t("user.column.username"),
    prop: "username"
  },
  {
    label: t("user.column.nickname"),
    prop: "nickname"
  },
  {
    label: t("user.column.name"),
    prop: "name"
  },
  {
    label: t("user.column.mobile"),
    prop: "mobile"
  },
  {
    label: t("user.column.sex"),
    prop: "sex",
    cellRenderer: scope => (
      <dict-tag options={sex.value} value={scope.row.sex}></dict-tag>
    )
  },
  {
    label: t("user.column.status"),
    prop: "status",
    cellRenderer: scope => (
      <dict-tag options={status.value} value={scope.row.status}></dict-tag>
    )
  },
  {
    label: t("user.column.createTime"),
    width: 180,
    prop: "createTime"
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    width: 200,
    slot: "operation"
  }
];

// 部门树搜索
function handleSelectTree(row) {
  props.queryParams.deptId = row.deptId;
  handleQuery();
}

// 重置密码
const resetPassword = (userId: number) => {
  passwordFormRef.value.openDialog(userId);
};

// 重置按钮
const handleReset = () => {
  queryFormRef.value.resetFields();
  props.queryParams.deptId = "";
  handleQuery();
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

:deep(.el-button:focus-visible) {
  outline: none;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
