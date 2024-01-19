import * as React from "react";
import { useDocument } from "office-ui-fabric-react";
import styles from "../../Dms.module.scss";
import style from "./styles.module.scss";

import TreeView from "../treeview/index";
import { DetailsListDocuments } from "../ListItems/DetailListShimmer";
import { CommandBarMenu } from "../CommandBar/index";
import DocumentDetails from "../Details/Details";
import {
  useFetchFolders,
  useFolderData,
  useHomeFolders,
} from "../treeview/func";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  const [folders, setFolders] = React.useState([] as any);

  console.log(folders, "files");

  React.useEffect(() => {
    const getItems = async () => {
      const data: any = await useHomeFolders();
      // await useFolderData("379ad2f3-634a-4324-beec-3585fc3d7037");
      setFolders(data);
    };
    getItems();
  }, []);

  return (
    <div className={style.dmsDashboard}>
      {/* <div className="ms-Grid-row"> */}
      <div className={style.navigation}>
        <TreeView />
      </div>
      <div className={style.detailsContainer}>
        <div className={style.detailsTable}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Modified</th>
                <th>Items</th>
                <th>File Size</th>
              </tr>
            </thead>
            <tbody>
              {folders?.map((item, i) => (
                <tr key={i}>
                  <td>
                    <Link to={`/${item?.UniqueId}`}>
                      <img
                        src={
                          "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/folder.svg"
                        }
                        alt={item?.Name}
                      />
                      {item?.Name}
                    </Link>
                  </td>
                  <td>{new Date(item?.TimeLastModified)?.toDateString()}</td>
                  <td>{item?.ItemCount}</td>
                  <td>{item?.folderSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <DetailsListDocuments /> */}
      {/* <DocumentDetails /> */}
      {/* </div> */}
      {/* <div className="ms-Grid-col ms-sm12 ms-lg4">
      </div>
      <div className="ms-Grid-col ms-sm12 ms-lg4 ms-xl1">
      </div> */}
      {/* </div> */}
    </div>
  );
};

export default HomeScreen;
