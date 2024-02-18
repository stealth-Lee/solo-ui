<template>
  <div class="main">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="props.queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="$t('post.column.name')" prop="name">
        <el-input
          v-model="props.queryParams.name"
          :placeholder="$t('post.tip.name')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('post.column.code')" prop="code">
        <el-input
          v-model="props.queryParams.code"
          :placeholder="$t('post.tip.code')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('post.column.sort')" prop="sort">
        <el-input
          v-model="props.queryParams.sort"
          :placeholder="$t('post.tip.sort')"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item>
        <el-tooltip :content="$t('buttons.common.search')" placement="top">
          <el-button
            v-auth="['system-post-query']"
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
          v-auth="['system-post-create']"
          type="primary"
          :icon="useRenderIcon('ep:plus')"
          @click="handleCreate()"
          plain
        >
          {{ t("buttons.common.create") }}
        </el-button>
        <el-button
          v-auth="['system-post-update']"
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
              v-auth="['system-post-delete']"
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
          v-auth="['system-post-import']"
          type="info"
          :icon="useRenderIcon('ep:upload')"
          @click="handleUpdate()"
          plain
        >
          {{ t("buttons.common.import") }}
        </el-button>
        <el-button
          v-auth="['system-post-export']"
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
          :columns="dynamicColumns"
          :loading="props.loading"
          :size="size"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          showOverflowTooltip
          adaptive
          :pagination="props.pagination"
          :paginationSmall="size === 'small' ? true : false"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-auth="['system-post-update']"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ep:edit-pen')"
              @click="handleUpdate(row.postId)"
            >
              {{ t("buttons.common.edit") }}
            </el-button>
            <el-popconfirm
              width="180"
              icon-color="red"
              :title="$t('commons.ask.delete')"
              @confirm="handleDelete(row.postId)"
            >
              <template #reference>
                <el-button
                  v-auth="['system-post-delete']"
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <PostForm ref="dialogFormRef" @refresh="loadData()" />
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BasicTableProps } from "@/hooks/table";
import { paging, deleting } from "@/api/system/post";

defineOptions({ name: "SysPost" });

const PostForm = defineAsyncComponent(() => import("./form.vue"));
const { t } = useI18n();
const queryFormRef = ref();
const dialogFormRef = ref();

const props: BasicTableProps = reactive<BasicTableProps>({
  title: t("post.title"),
  pk: "postId",
  listApi: paging,
  deleteApi: deleting,
  queryRef: queryFormRef,
  formRef: dialogFormRef
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
    width: 40
  },
  {
    label: "#",
    type: "index",
    width: 40
  },
  {
    label: t("post.column.name"),
    prop: "name",
    minWidth: 120
  },
  {
    label: t("post.column.code"),
    prop: "code",
    minWidth: 120
  },
  {
    label: t("post.column.sort"),
    prop: "sort",
    minWidth: 120
  },
  {
    label: t("post.column.createTime"),
    prop: "createTime",
    minWidth: 120
  },
  {
    label: t("post.column.remark"),
    prop: "remark",
    minWidth: 120
  },
  {
    label: t("commons.columns.action"),
    fixed: "right",
    width: 160,
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
