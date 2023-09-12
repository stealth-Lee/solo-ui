interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parentId: number;
  deptName: string;
  deptCode: string;
  deptSort: number;
  deleted: number;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
