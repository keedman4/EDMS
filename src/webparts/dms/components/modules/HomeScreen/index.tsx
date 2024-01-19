import * as React from "react";
import { useDocument } from "office-ui-fabric-react";
import styles from '../../Dms.module.scss';

import TreeView from '../treeview/index';
import {DetailsListDocuments} from '../ListItems/DetailListShimmer';
import {CommandBarMenu} from '../CommandBar/index';
import DocumentDetails from '../Details/Details';

const HomeScreen = () => {   
    return (
    <div className={`${styles.dms} ms-Grid`} dir="ltr">
    {/* <div className="ms-Grid-row"> */}
    <div className="ms-Grid-col ms-sm12 ms-lg4">
        <TreeView />
      </div>
      <div className="ms-Grid-col ms-sm12 ms-lg4">
        <DetailsListDocuments/>
      </div>
      <div className="ms-Grid-col ms-sm12 ms-lg4 ms-xl1">
        <DocumentDetails/>
      </div>
    {/* </div> */}
  </div>
);
};

export default HomeScreen;