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
      <td>{item?.ItemCount || "N/A"}</td>
      <td>{item?.folderSize}</td>
    </tr>
  );
}
const FolderView = ({ folderData }) => {
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState("asc");

  const sortedData = [
    ...(folderData?.folders || []),
    ...(folderData?.files || []),
  ].sort((a, b) => {
    if (sortField) {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    return 0;
  });

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
              <th onClick={() => handleSort("Name")}>Name</th>
              <th onClick={() => handleSort("TimeLastModified")}>
                Date Modified
              </th>
              <th onClick={() => handleSort("ItemCount")}>Items</th>
              <th onClick={() => handleSort("folderSize")}>File Size</th>
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
