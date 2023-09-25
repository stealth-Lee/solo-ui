import { type PaginationProps } from "@pureadmin/table";
import { onMounted } from "vue";

/**
 * 表格组件基础配置属性
 */
export interface BasicTableProps {
  // 查询条件表单对象，类型为any
  queryParams?: any;
  // 数据列表数组
  dataList?: any[];
  // 分页属性对象
  pagination?: PaginationProps;
  pageList?: (...arg: any) => Promise<any>;
}

export function useTable(options?: BasicTableProps) {
  const defaultOptions: BasicTableProps = {
    queryParams: {},
    // 表格展示的数据数组，默认为空数组
    dataList: [],
    // 分页组件属性配置，如当前页码、每页展示数据条数等，默认值为 {current:1, size:10,total:0,pageSizes:[1, 10, 20, 50, 100, 200],layout:'total, sizes, prev, pager, next, jumper'}
    pagination: {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      background: true
    } as PaginationProps
  };

  /**
   * 合并默认属性配置和自定义属性配置
   * @param defaultOptions 默认属性配置对象
   * @param options 自定义属性配置对象
   * @returns 合并后的属性配置对象
   */
  const mergeDefaultOptions = (
    defaultOptions: any,
    options: any
  ): BasicTableProps => {
    for (const key in defaultOptions) {
      if (!Object.getOwnPropertyDescriptor(options, key)) {
        options[key] = defaultOptions[key];
      }
    }
    return options;
  };

  // 覆盖默认值
  const table = mergeDefaultOptions(defaultOptions, options);

  /**
   * 发起分页查询，并设置表格数据和分页信息
   */
  const query = async () => {
    // 判断是否存在state.pageList属性
    if (table.pageList) {
      try {
        // 开始加载数据，设置state.loading为true
        table.loading = true;

        // 调用state.pageList方法发起分页查询
        const res = await table.pageList({
          ...table.queryParams,
          pageNumber: table.pagination?.currentPage,
          pageSize: table.pagination?.pageSize
        });

        // 设置表格展示的数据数组
        table.dataList = table.isPage ? res.data[table.props.item] : res.data;
        // 设置分页信息中的总数据条数
        table.pagination!.total = table.isPage ? res.data[table.props.totalCount] : 0;
      } catch (err: any) {
        // 捕获异常并显示错误提示
        ElMessage.error(err.msg || err.data.msg);
      } finally {
        // 结束加载数据，设置state.loading为false
        table.loading = false;
      }
    }
  };

  onMounted(() => {
    query();
  });
}
