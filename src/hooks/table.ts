import { onMounted } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";

export interface BasicTableProps {
  // 标题
  title?: string;
  // 是否在创建页面时即调用数据列表接口
  createdIsNeed?: boolean;
  // 查询条件参数，类型为any
  queryParams?: any;
  // 分页属性对象
  pagination?: PaginationProps;
  // 数据列表接口
  listApi?: (...arg: any) => Promise<any>;
  // 删除函数
  deleteApi?: (...arg: any) => Promise<any>;
  // loading标志
  loading?: boolean;
  // 数据列表数组
  dataList?: any[];
  // 查询表单ref
  formRef?: any;
  dialogRef?: any;
  // 单选启用
  single?: boolean;
  // 多选启用
  multiple?: boolean;
  // 选中的集合id
  pk?: any;
  ids?: any[];
}

export function useTable(options?: BasicTableProps) {
  const defaultOptions: BasicTableProps = {
    createdIsNeed: true,
    queryParams: {},
    pagination: {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      background: true
    },
    loading: false,
    dataList: [],
    pk: "id",
    single: true,
    multiple: true
  };

  /**
   * 合并默认属性配置和自定义属性配置
   * @param options 默认属性配置对象
   * @param props 自定义属性配置对象
   * @returns 合并后的属性配置对象
   */
  const mergeDefaultOptions = (options: any, props: any): BasicTableProps => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key];
      }
    }
    return props;
  };

  const props = mergeDefaultOptions(defaultOptions, options);

  // 加载数据
  const loadData = async () => {
    if (props.listApi) {
      props.loading = true;
      try {
        const res = await props.listApi({
          ...props.queryParams,
          pageNumber: props.pagination?.currentPage,
          pageSize: props.pagination?.pageSize
        });
        if (res.code === 0) {
          const data = res.data;
          props.dataList = data.records;
          props.pagination.total = data.totalRow;
          props.pagination.pageSize = data.pageSize;
        }
      } catch (err: any) {
        // 捕获异常并显示错误提示
        message(err.msg || err.data.msg, { customClass: "el", type: "error" });
      } finally {
        props.loading = false;
      }
    }
  };

  // 页面大小改变事件
  const handleSizeChange = (val: number) => {
    props.queryParams.pageSize = val;
    loadData();
  };

  // 当前页码改变事件
  const handleCurrentChange = (val: number) => {
    props.queryParams.pageNumber = val;
    loadData();
  };

  // 表格选中事件
  const handleSelectionChange = (selection: any) => {
    props.ids = selection.map(item => item[props.pk]);
    props.single = selection.length != 1;
    props.multiple = !selection.length;
  };

  // 搜索按钮
  const handleQuery = () => {
    loadData();
  };

  // 重置按钮
  const handleReset = () => {
    props.formRef.resetFields();
    handleQuery();
  };

  // 新增按钮
  const handleCreate = () => {
    props.dialogRef.openDialog("新增" + props.title);
  };

  // 编辑按钮
  const handleUpdate = (id?: number) => {
    const ids = id || props.ids;
    props.dialogRef.openDialog("编辑" + props.title, ids);
  };

  // 删除按钮
  const handleDelete = async (id?: any[]) => {
    const ids = id || props.ids;
    await props.deleteApi(ids);
    message(`${props.title}删除成功！`, { type: "success" });
    await loadData();
  };

  // 初始化数据
  onMounted(() => {
    if (props.createdIsNeed) {
      loadData();
    }
  });

  return {
    loadData,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleQuery,
    handleReset,
    handleCreate,
    handleUpdate,
    handleDelete
  };
}
