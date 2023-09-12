import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { insert, del, tree } from "@/api/system/dept";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type FormItemProps } from "../utils/types";
import { cloneDeep } from "@pureadmin/utils";

export function useDept() {
  const form = reactive({
    deptName: null,
    deptCode: null
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

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

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  // 重置按钮
  const resetForm = (formEl: any) => {
    if (!formEl) return;
    formEl.resetFields();
    getData();
  };

  const getData = async () => {
    loading.value = true;
    try {
      const res = await tree(toRaw(form)); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
      if (res.code === 200) {
        dataList.value = handleTree(res.data, "deptId"); // 处理成树结构
      }
    } finally {
      loading.value = false;
    }
  };

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  // 新增按钮
  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          higherDeptOptions: formatHigherDeptOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? 0,
          deptName: row?.deptName ?? "",
          deptCode: row?.deptCode ?? "",
          deptSort: row?.deptSort ?? 0,
          remark: row?.remark ?? ""
        }
      },
      width: "39%",
      style: { marginRight: "0", marginTop: "0", height: "100%" },
      draggable: false,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`部门[${curData.deptName}]${title}成功！`, {
            type: "success"
          });
          done(); // 关闭弹框
          getData(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              insert(toRaw(curData));
              chores();
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  // 删除按钮
  const handleDelete = async (row: any) => {
    await del(row.deptId);
    message(`部门[${row.deptName}]删除成功！`, { type: "success" });
    getData();
  };

  onMounted(() => {
    getData();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    getData,
    /** 重置 */
    resetForm,
    /** 新增、编辑部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange
  };
}
