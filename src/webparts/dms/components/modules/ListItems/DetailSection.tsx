import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { TooltipHost } from "@fluentui/react";
import styles from "../../Dms.module.scss";

export interface IDetailsListDocumentsExampleState {
  columns: IColumn[];
  items: IDocument[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
}

export interface IDocument {
  key: string;
  name: string;
  value: string;
  iconName: string;
  fileType: string;
  modifiedBy: string;
  dateModified: string;
  dateModifiedValue: number;
  fileSize: string;
  fileSizeRaw: number;
}
const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: "16px",
  },
  fileIconCell: {
    textAlign: "center",
    selectors: {
      "&:before": {
        content: ".",
        display: "inline-block",
        verticalAlign: "middle",
        height: "100%",
        width: "0px",
        visibility: "hidden",
      },
    },
  },
  fileIconImg: {
    verticalAlign: "middle",
    maxHeight: "16px",
    maxWidth: "16px",
  },
  controlWrapper: {
    display: "flex",
    flexWrap: "wrap",
  },
  exampleToggle: {
    display: "inline-block",
    marginBottom: "10px",
    marginRight: "30px",
  },
  selectionDetails: {
    marginBottom: "20px",
  },
});
const controlStyles = {
  root: {
    margin: "0 30px 20px 0",
    maxWidth: "300px",
  },
};

const columns: IColumn[] = [
  {
    key: "column1",
    name: "File Type",
    className: classNames.fileIconCell,
    iconClassName: classNames.fileIconHeaderIcon,
    ariaLabel: "Column operations for File type, Press to sort on File type",
    iconName: "Page",
    isIconOnly: true,
    fieldName: "name",
    minWidth: 16,
    maxWidth: 16,
    //  onColumnClick: this._onColumnClick,
    onRender: (item: IDocument) => (
      <TooltipHost content={`${item.fileType} file`}>
        <img
          src={item.iconName}
          className={classNames.fileIconImg}
          alt={`${item.fileType} file icon`}
        />
      </TooltipHost>
    ),
  },
  {
    key: "column2",
    name: "Name",
    fieldName: "name",
    minWidth: 210,
    maxWidth: 350,
    isRowHeader: true,
    isResizable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: "Sorted A to Z",
    sortDescendingAriaLabel: "Sorted Z to A",
    //  onColumnClick: this._onColumnClick,
    data: "string",
    isPadded: true,
  },
  {
    key: "column3",
    name: "Date Modified",
    fieldName: "dateModifiedValue",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    //  onColumnClick: this._onColumnClick,
    data: "number",
    onRender: (item: IDocument) => {
      return <span>{item.dateModified}</span>;
    },
    isPadded: true,
  },
  {
    key: "column4",
    name: "Modified By",
    fieldName: "modifiedBy",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: "string",
    //  onColumnClick: this._onColumnClick,
    onRender: (item: IDocument) => {
      return <span>{item.modifiedBy}</span>;
    },
    isPadded: true,
  },
  {
    key: "column5",
    name: "File Size",
    fieldName: "fileSizeRaw",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: "number",
    //  onColumnClick: this._onColumnClick,
    onRender: (item: IDocument) => {
      return <span>{item.fileSize}</span>;
    },
  },
];

interface IDetailsListDocumentsProps {}

interface IDetailsListDocumentsState {
  items: IDocument[];
  columns: IColumn[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
}

const DetailsListDocuments: React.FC<IDetailsListDocumentsProps> = () => {
  const [items, setItems] = React.useState<IDocument[]>([]);
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [selectionDetails, setSelectionDetails] = React.useState<string>("");
  const [isModalSelection, setIsModalSelection] =
    React.useState<boolean>(false);
  const [isCompactMode, setIsCompactMode] = React.useState<boolean>(false);
  const [announcedMessage, setAnnouncedMessage] = React.useState<
    string | undefined
  >("");

  return (
    <div className={`${styles.listItems}`}>
      <DetailsList
        items={items}
        compact={isCompactMode}
        columns={columns}
        selectionMode={SelectionMode.none}
        // getKey={getKey}
        setKey="none"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        // onItemInvoked={onItemInvoked}
      />
    </div>
  );
};

export default DetailsListDocuments;
