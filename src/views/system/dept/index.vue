<template>
  <div class="main">
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="部门名称：" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="部门编码：" prop="deptCode">
        <el-input
          v-model="queryParams.deptCode"
          placeholder="请输入部门编码"
          clearable
          class="!w-[200px]"
        />
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
        <el-button :icon="useRenderIcon(Refresh)" @click="handleReset">
          重置
        </el-button>
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
          :icon="useRenderIcon(AddFill)"
          @click="handleCreateOrUpdate()"
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
          :loading="loading"
          :size="size"
          :data="dataList"
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
              :icon="useRenderIcon(EditPen)"
              @click="handleCreateOrUpdate('编辑', row.deptId)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`是否删除[${row.deptName}]?`"
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <dept-form ref="deptDialogFormRef" @refresh="getData()" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, onMounted, reactive, defineAsyncComponent } from "vue";
import { message } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { handleTree } from "@/utils/tree";
import { deleting, listing } from "@/api/system/dept";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

const DeptForm = defineAsyncComponent(() => import("./form.vue"));

const queryFormRef = ref();
const deptDialogFormRef = ref();
const tableRef = ref();
const dataList = ref([]);
const loading = ref(true);

defineOptions({
  name: "Dept"
});

const queryParams = reactive({
  deptName: null,
  deptCode: null
});

const columns: TableColumnList = [
  {
    label: "部门名称",
    prop: "deptName",
    width: 180,
    align: "left"
  },
  {
    label: "部门编码",
    prop: "deptCode",
    width: 180,
    align: "left"
  },
  {
    label: "排序",
    prop: "deptSort",
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

// 查询部门列表
const getData = async () => {
  loading.value = true;
  try {
    const res = await listing(toRaw(queryParams)); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    if (res.code === 0) {
      dataList.value = handleTree(res.data, "deptId"); // 处理成树结构
    }
  } finally {
    loading.value = false;
  }
};

// 搜索按钮
const handleQuery = () => {
  getData();
};

// 重置按钮
const handleReset = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

// 删除按钮
const handleDelete = async (row: any) => {
  await deleting(row.deptId);
  message(`部门[${row.deptName}]删除成功！`, { type: "success" });
  await getData();
};

// 新增、编辑按钮
const handleCreateOrUpdate = (title = "新增", id?: number) => {
  deptDialogFormRef.value.openDialog(title, id);
};

// 初始化
onMounted(async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
