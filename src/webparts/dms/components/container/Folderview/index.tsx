import * as React from "react";
import { Link } from "react-router-dom";
import style from "./styles.module.scss";

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

function renderTableRow(item, index) {
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
const FolderView = ({ folderData, main = false }) => {
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState("asc");

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

  return (
    <div className={style.detailsContainer}>
      <div className={style.detailsTable}>
        <table>
          <thead>
            <tr>
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
            {sortedData.map((item, index) => renderTableRow(item, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FolderView;
