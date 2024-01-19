import * as React from "react";
import { useFetchFolders } from "./func";
import { useDocument } from "office-ui-fabric-react";
import { Link, useHistory } from "react-router-dom";

import { Nav, initializeIcons } from "@fluentui/react";

import styles from "../../Dms.module.scss";

const navigationStyles = {
  root: {
    height: "100vh",
    width: "20%",
    boxSizing: "border-box",
    border: "1px solid #eee",
    overflowY: "auto",
    float: "left",
    margin: "0",
    //paddingTop: '10vh',
  },
};

const TreeView = () => {
  const [folders, setFolders] = React.useState([]);
  const links = [
    {
      links: folders,
    },
  ];

  const [newItems, setNewItems] = React.useState({});

  const toggleHandler = (id) => {
    setNewItems((prevState) => {
      const newState = { ...prevState };

      // Toggle the state for the specified id
      newState[id] = !newState[id];

      // Close all other nested items at the same level if the current one is expanded
      if (newState[id]) {
        Object.keys(newState).forEach((key) => {
          if (key !== id && key.startsWith(`${id}.`)) {
            newState[key] = false;
          }
        });
      }

      return newState;
    });
  };

  const renderLinksRecursive = (
    links,
    toggleHandler,
    newItems,
    parentId = null
  ) => {
    return (
      <ul>
        {links.map((item, i) => (
          <li key={i}>
            {item.folders?.length > 0 ? (
              <p
                onClick={() =>
                  toggleHandler(
                    `${parentId !== null ? parentId + "." : ""}${i}`
                  )
                }
              >
                {item?.Name}
                &nbsp;&nbsp;
                {/* <FaCaretDown /> */}
              </p>
            ) : (
              <Link to={`/documents/${item?.UniqueId}`}>{item?.Name}</Link>
            )}
            {newItems[`${parentId !== null ? parentId + "." : ""}${i}`] &&
              item.folders?.length > 0 &&
              renderLinksRecursive(
                item.folders,
                toggleHandler,
                newItems,
                `${parentId !== null ? parentId + "." : ""}${i}`
              )}
          </li>
        ))}
      </ul>
    );
  };
  // const data = getDocumentLibrary();
  // console.log(data, "get Documents");

  React.useEffect(() => {
    const getItems = async () => {
      initializeIcons();
      const data = await useFetchFolders();
      setFolders(data);
    };
    getItems();
  }, []);

  console.log("folders", folders);

  return <Nav groups={links} selectedKey="key1" styles={navigationStyles} />;

  // <div className={styles.links}>
  //     <ul>{renderLinksRecursive(folders, toggleHandler, newItems)}</ul>
  //   </div>
};

export default TreeView;
