<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('role.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('role.tip.name')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('role.column.code')" prop="code">
        <el-input
          v-model="props.queryParams.code"
          :placeholder="$t('role.tip.code')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('role.column.status')" prop="status">
        <el-select
          v-model="props.queryParams.status"
          :placeholder="$t('role.tip.status')"
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
          align-whole="center"
          table-layout="auto"
          :data="props.dataList"
          :loading="props.loading"
          :columns="dynamicColumns"
          :size="size"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="props.pagination"
          :paginationSmall="size === 'small' ? true : false"
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
              @click="handleUpdate(row.roleId)"
            >
              {{ t("buttons.common.update") }}
            </el-button>
            <el-popconfirm
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.roleId)"
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
                      @click="handleAssignMenu(row)"
                    >
                      {{ t("role.button.menu") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('ri:database-2-line')"
                    >
                      {{ t("role.button.data") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('ep:user')"
                    >
                      {{ t("role.button.user") }}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <!-- 角色编辑弹窗 -->
    <RoleForm ref="roleFormRef" @refresh="loadData()" />
    <!-- 菜单权限弹窗 -->
    <AssignMenu ref="assignMenuFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting, updateStatus, RoleReq } from "@/api/system/role";
defineOptions({ name: "SysRole" });

const RoleForm = defineAsyncComponent(() => import("./form.vue"));
const AssignMenu = defineAsyncComponent(() => import("./assignMenu.vue"));

const queryFormRef = ref();
const roleFormRef = ref();
const assignMenuFormRef = ref();
const { t } = useI18n();
const { status } = useDict("status");
const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("role.title"),
  pk: "roleId",
  listApi: paging,
  deleteApi: deleting,
  switchApi: updateStatus,
  switchField: "status",
  queryRef: queryFormRef,
  formRef: roleFormRef
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
    width: 40
  },
  {
    label: "#",
    type: "index",
    width: 40
  },
  {
    label: t("role.column.name"),
    prop: "name",
    minWidth: 120
  },
  {
    label: t("role.column.code"),
    prop: "code",
    minWidth: 150
  },
  {
    label: t("role.column.remark"),
    prop: "remark",
    minWidth: 150
  },
  {
    label: t("role.column.createTime"),
    minWidth: 180,
    prop: "createTime"
  },
  {
    label: t("role.column.status"),
    minWidth: 130,
    cellRenderer: scope => (
      <el-switch
        v-model={scope.row.status}
        active-value={1}
        inactive-value={0}
        onChange={() => handleSwitch(scope.row, scope.row.name)}
      />
    )
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    width: 200,
    slot: "operation"
  }
];

const handleAssignMenu = (role: RoleReq) => {
  assignMenuFormRef.value.open(role);
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
