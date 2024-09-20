import { IconNames } from '@dx/ui-web-system';
import {
  PrimitiveTypes,
  SortDirType
} from '@dx/config-shared';

export type CellAlignment = 'left' | 'center' | 'right' | 'justify' | 'inherit';
export type ComponentType = 'text' | 'icon' | 'checkbox' | 'none';

export type TableComponentProps = {
  changeFilter?: (value: string) => void;
  changeLimit?: (limit: number) => void;
  changeOffset?: (offset: number) => void;
  changeSort?: (fieldName: string) => void;
  clickRow?: (rowData: TableRowType) => void;
  count: number;
  header: TableHeaderItem[];
  isInitialized: boolean;
  loading?: boolean;
  limit: number;
  maxHeight?: string;
  offset: number;
  orderBy?: string;
  rows: TableRowType[];
  sortDir: SortDirType;
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
  dataType: PrimitiveTypes | null;
  icon?: IconNames;
  onClick?: (id: string, actionType: string) => void;
};

export type TableDummyColumn = number[];

export type TableDummyRow = TableDummyColumn[];

export type TableMeta = {
  align?: CellAlignment;
  componentType: ComponentType;
  fieldName: string;
  fieldType: PrimitiveTypes | null;
  headerAlign: CellAlignment;
  sortable: boolean;
  title: string;
  width?: string | number;
};
