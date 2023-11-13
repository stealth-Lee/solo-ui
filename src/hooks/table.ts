import { useWatermark, delay } from "@pureadmin/utils";
import { type PaginationProps } from "@pureadmin/table";
import { useMessage, useMessageBox } from "@/hooks/message";
import { GlobalStatus } from "@/utils/constants";
import { handleTree } from "@/utils/tree";
import { i18n } from "@/plugins/i18n";
import download from "@/hooks/download";

const { t } = i18n.global;
const message = useMessage();
const messageBox = useMessageBox();

type Type = "table" | "tree";

export interface BasicTableProps {
  // 表格类型
  type?: Type;
  // 标题
  title?: string;
  // 是否在创建页面时即调用数据列表接口
  createdIsNeed?: boolean;
  // 查询条件参数，类型为any
  queryParams?: any;
  // 分页属性对象
  pagination?: PaginationProps;
  // 数据列表API
  listApi?: (...arg: any) => Promise<any>;
  // 删除API
  deleteApi?: (...arg: any) => Promise<any>;
  // 状态切换API
  switchApi?: (...arg: any) => Promise<any>;
  // 导出API
  exportApi?: (...arg: any) => Promise<any>;
  // 主键名
  pk?: any;
  // 状态字段名
  switchField?: any;
  // loading标志
  loading?: boolean;
  // 数据列表数组
  dataList?: any[];
  // 查询表单ref
  queryRef?: any;
  // 列表表单ref
  listRef?: any;
  // 窗口ref
  formRef?: any;
  // 单选启用
  single?: boolean;
  // 多选启用
  multiple?: boolean;
  // 选中的集合id
  ids?: any[];
}

export function useTable(options?: BasicTableProps) {
  const defaultOptions: BasicTableProps = {
    type: "table",
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
        if (props.type === "table") {
          // 普通分页表格处理
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
        } else {
          // 树形表格处理
          const res = await props.listApi({
            ...props.queryParams
          });
          if (res.code === 0) {
            const data = res.data;
            props.dataList = handleTree(data, props.pk);
          }
        }
      } catch (err: any) {
        // 捕获异常并显示错误提示
        message.error(err.msg || err.data.msg);
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
    props.queryRef.resetFields();
    handleQuery();
  };

  // 新增按钮
  const handleCreate = () => {
    props.formRef.openDialog(`${t("commons.buttons.create")}${props.title}`);
  };

  // 编辑按钮
  const handleUpdate = (id?: number) => {
    const ids = id || props.ids;
    props.formRef.openDialog(`${t("commons.buttons.edit")}${props.title}`, ids);
  };

  // 删除按钮
  const handleDelete = async (id?: any[]) => {
    const ids = id || props.ids;
    await props.deleteApi(ids);
    message.success(`${props.title}${t("commons.prompt.delete")}`);
    await loadData();
  };

  // 状态切换按钮
  const handleSwitch = async (row: any, name?: any) => {
    try {
      await messageBox.switch(row[props.switchField], name, props.title);
      await props.switchApi(row[props.pk], row[props.switchField]);
      await loadData();
      await message.success(t("commons.prompt.action"));
    } catch {
      row[props.switchField] =
        row[props.switchField] === GlobalStatus.ENABLE
          ? GlobalStatus.DISABLE
          : GlobalStatus.ENABLE;
    }
  };

  // 导出按钮
  const handleExport = async () => {
    const data = await props.exportApi({ ...props.queryParams });
    download.excel(data, "字典数据.xls");
  };

  // 初始化数据
  onMounted(() => {
    if (props.createdIsNeed) {
      loadData();
    }
    // TODO 先暂时保留
    if (props.listRef) {
      delay().then(() => {
        const { setWatermark } = useWatermark(
          props.listRef.getTableDoms().tableWrapper
        );
        setWatermark("SOLO ADMIN", {
          font: "16px Microsoft YaHei",
          globalAlpha: 0.8,
          forever: true,
          width: 252,
          height: 80
        });
      });
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
    handleDelete,
    handleSwitch,
    handleExport
  };
}
