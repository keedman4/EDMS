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
import FolderView from "../../container/Folderview";

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
      <FolderView folderData={folders} main={true} />
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
