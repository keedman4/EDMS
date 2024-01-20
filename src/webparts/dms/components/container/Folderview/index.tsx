import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import style from "./styles.module.scss";
import Modal from "../Modal";
import ImageUpload from "../FileUpload/ImageUpload";
import { useFileUpload } from "../../modules/treeview/func";
function getFileType(item) {
  const fileExtension = item?.Name.substring(
    item.Name.lastIndexOf(".") + 1
  )?.toLowerCase();

  if (["png", "jpeg", "jpg", "bmp"].includes(fileExtension)) {
    return "photo";
  } else if (
    ["mp4" /* add other video formats here */].includes(fileExtension)
  ) {
    return "video";
  } else if (
    ["mp3" /* add other audio formats here */].includes(fileExtension)
  ) {
    return "audio";
  } else {
    // Default to 'document' or any other type
    return fileExtension;
  }
}

function renderTableRow(item, index, selectedRows, handleRowSelect) {
  const isFolder = item.hasOwnProperty("ItemCount");

  const fileType = getFileType(item);
  const iconSrc = isFolder
    ? "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/folder.svg"
    : `https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/${fileType}.svg`;

  const linkTo = isFolder
    ? `/${item?.UniqueId}`
    : `https://loctus.sharepoint.com/${item?.Name}`;

  return (
    <tr key={index}>
      <td
        style={{
          padding: "16px",
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
          textAlign: "left",
        }}
      >
        <input
          type="checkbox"
          checked={selectedRows.includes(item.UniqueId)}
          onChange={(e) => handleRowSelect(item.UniqueId, e.target.checked)}
        />
      </td>
      <td>
        <Link to={linkTo}>
          <img src={iconSrc} alt={item?.Name} />
          {item?.Name}
        </Link>
      </td>
      <td>{new Date(item?.TimeLastModified)?.toDateString()}</td>
      <td>{item?.ItemCount || 0}</td>
      <td>{item?.folderSize}</td>
    </tr>
  );
}
const FolderView = ({ folderData, main = false, id = "" }) => {
  const history = useHistory();
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [uploaded, setUploaded] = React.useState({});

  const sortedData = main
    ? folderData.sort((a, b) =>
        compareValues(a[sortField], b[sortField], sortOrder)
      )
    : [...(folderData?.folders || []), ...(folderData?.files || [])].sort(
        (a, b) => compareValues(a[sortField], b[sortField], sortOrder)
      );

  function compareValues(aValue, bValue, sortOrder) {
    if (sortOrder === "asc") {
      return aValue && bValue ? aValue.localeCompare(bValue) : 0;
    } else {
      return bValue && aValue ? bValue.localeCompare(aValue) : 0;
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRowSelect = (rowId, isSelected) => {
    const updatedSelectedRows = isSelected
      ? [...selectedRows, rowId]
      : selectedRows.filter((id) => id !== rowId);

    setSelectedRows((prevSelectedRows) => {
      if (isSelected) {
        return [...prevSelectedRows, rowId];
      } else {
        return prevSelectedRows?.filter((id) => id !== rowId);
      }
    });
    // onSelectedRowsChange(updatedSelectedRows);
  };

  const selectAllRows = () => {
    const allRowIds = sortedData?.map((item) => item.UniqueId);
    setSelectedRows(allRowIds);
  };

  const clearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleChange = (name, files) => {
    const fileArray = Array.from(files || []);

    const fileUpload = { file: fileArray, id } as any;
    setUploaded(fileUpload);
  };

  const submitHandler = async () => {
    const data = await useFileUpload(uploaded);
  };
  return (
    <div className={style.detailsContainer}>
      <div className={style.detailsTable}>
        <div className={style.topRow}>
          <span onClick={() => history.goBack()}>&#8592; Go Back</span>
          <div>
            {selectedRows?.length > 0 && (
              <span onClick={() => history.goBack()}>Delete</span>
            )}
            {!main && <span onClick={() => setOpen(!open)}>Upload File</span>}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th
                style={{
                  padding: "16px",
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  textAlign: "left",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRows.length === sortedData.length}
                  onChange={() =>
                    selectedRows.length === sortedData.length
                      ? clearSelectedRows()
                      : selectAllRows()
                  }
                />
              </th>

              <th onClick={() => handleSort("Name")}>
                Name {sortField === "Name" && sortOrder === "asc" && "↑"}
                {sortField === "Name" && sortOrder === "desc" && "↓"}
              </th>
              <th onClick={() => handleSort("TimeLastModified")}>
                Date Modified{" "}
                {sortField === "TimeLastModified" && sortOrder === "asc" && "↑"}
                {sortField === "TimeLastModified" &&
                  sortOrder === "desc" &&
                  "↓"}
              </th>
              <th onClick={() => handleSort("ItemCount")}>
                Items {sortField === "ItemCount" && sortOrder === "asc" && "↑"}
                {sortField === "ItemCount" && sortOrder === "desc" && "↓"}
              </th>
              <th onClick={() => handleSort("folderSize")}>
                File Size{" "}
                {sortField === "folderSize" && sortOrder === "asc" && "↑"}
                {sortField === "folderSize" && sortOrder === "desc" && "↓"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) =>
              renderTableRow(item, index, selectedRows, handleRowSelect)
            )}
          </tbody>
        </table>
        <Modal
          title="Upload File"
          content={
            <div>
              <ImageUpload
                name="Image"
                onChange={handleChange}
                label="Upload File"
                multiple={true}
              />
              <button onClick={submitHandler} className="btn btnBlue">
                Upload File
              </button>
            </div>
          }
          size="medium"
          isVisible={open}
          onClose={() => setOpen(!open)}
        />
      </div>
    </div>
  );
};

export default FolderView;
