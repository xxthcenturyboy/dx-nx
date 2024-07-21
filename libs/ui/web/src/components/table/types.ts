import { IconNames } from '../../icons';

export type CellAlignment = 'left' | 'center' | 'right' | 'justify' | 'inherit';
export type ComponentType = 'text' | 'icon' | 'checkbox' | 'none';

export type TableComponentProps = {
  changeFilter?: (value: string) => void;
  changeLimit?: (limit: number) => void;
  changeOffset?: (offset: number) => void;
  changeSort?: (fieldName: string) => void;
  clickRow?: (rowData: unknown) => void;
  collapsible?: boolean;
  count: number;
  header: TableHeaderItem[];
  loading?: boolean;
  limit: number;
  maxHeight?: string;
  offset: number;
  orderBy?: string;
  refreshData?: () => Promise<void>;
  rows: TableRowType[];
  sortDir: string;
  tableName: string;
};

export type TableHeaderItem = {
  align?: CellAlignment;
  fieldName: string;
  sortable: boolean;
  title: string;
  width?: string | number;
};

export type TableRowType = {
  id: string;
  columns: TableCellData[];
};

export type TableCellData = {
  align?: CellAlignment;
  color?: string;
  componentType: ComponentType;
  data: unknown;
  dataType: string | null;
  icon?: IconNames;
  onClick?: (id: string, actionType: string) => void;
};

export type TableDummyColumn = number[];

export type TableDummyRow = TableDummyColumn[];

export type TableMeta = {
  align?: CellAlignment;
  componentType: ComponentType;
  fieldName: string;
  fieldType: string | null;
  headerAlign: CellAlignment;
  sortable: boolean;
  title: string;
  width?: string | number;
};
