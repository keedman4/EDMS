import { sp } from "@pnp/sp";
import { uniqueId } from "lodash";

export async function useFetchFolders() {
  try {
    const fetchFolderDataRecursive = async (folder) => {
      const folderItem = await sp.web
        .getFolderById(folder.UniqueId)
        .folders.get();

      const fetchSubfolderContentsRecursive = async (subFolder) => {
        const subfolderItem = await sp.web
          .getFolderById(subFolder.UniqueId)
          .folders.get();

        const visibleSubFolder = await Promise.all(
          subfolderItem
            .filter(
              (innerSubFolder) =>
                !innerSubFolder.Name.startsWith("_") &&
                innerSubFolder.Name !== "Forms" &&
                innerSubFolder.Name !== "AllItems"
            )
            .map(fetchSubfolderContentsRecursive)
        );

        return {
          name: subFolder.Name,
          key: subFolder?.UniqueId,
          url: `/${subFolder?.UniqueId}`,
          TimeCreated: subFolder.TimeCreated,
          TimeLastModified: subFolder.TimeLastModified,
          UniqueId: subFolder.UniqueId,
          ServerRelativeUrl: subFolder.ServerRelativeUrl,
          ItemCount: subFolder.ItemCount,
          links: visibleSubFolder,
          //   iconProps: {
          //     iconName: "DocLibrary",
          //     styles: {
          //       root: {
          //         fontSize: 20,
          //         color: "#106ebe",
          //       },
          //     },
          //   },
        };
      };

      const visibleFolders = await Promise.all(
        folderItem
          .filter(
            (subFolder) =>
              !subFolder.Name.startsWith("_") &&
              subFolder.Name !== "Forms" &&
              subFolder.Name !== "AllItems"
          )
          .map(fetchSubfolderContentsRecursive)
      );

      return {
        name: folder?.Name,
        key: folder?.UniqueId,
        url: `/${folder?.UniqueId}`,
        ItemCount: folder?.ItemCount,
        TimeCreated: folder?.TimeCreated,
        TimeLastModified: folder?.TimeLastModified,
        UniqueId: folder?.UniqueId,
        ServerRelativeUrl: folder?.ServerRelativeUrl,
        links: visibleFolders,
        // iconProps: {
        //   iconName: "DocLibrary",
        //   styles: {
        //     root: {
        //       fontSize: 20,
        //       color: "#106ebe",
        //     },
        //   },
        // },
      };
    };

    const webFolders = await sp.web.folders();

    const filteredWebFolders = webFolders.filter(
      (folder) =>
        !folder.Name.startsWith("_") &&
        folder.Name !== "Forms" &&
        folder.Name !== "AllItems"
    );

    const all = await Promise.all(
      filteredWebFolders.map(fetchFolderDataRecursive)
    );

    return all;
  } catch (error) {
    console.error("Error fetching folders data:", error);
    throw error;
  }
}

export async function useFolderData(folder) {
  const single = await sp.web.getFolderById(folder).get();
  const folders = await sp.web.getFolderById(folder);
  const folderDetails = await folders.expand("ModifiedBy").get();

  console.log(folderDetails, "folderDetails");
  const folderItem = await sp.web.getFolderById(folder).folders.get();
  const visibleFolders = folderItem.filter(
    (subFolder) =>
      !subFolder.Name.startsWith("_") &&
      subFolder.Name !== "Forms" &&
      subFolder.Name !== "AllItems"
  );

  const files = await sp.web.getFolderById(folder).files.get();

  const formattedFiles = files.map((file) => ({
    ...file,
    TimeCreated: new Date(file.TimeCreated).toLocaleDateString(),
    TimeLastModified: new Date(file.TimeLastModified).toLocaleDateString(),
  }));

  return {
    Name: single?.Name,
    name: single?.Name,
    key: folder,
    url: `/${folder}`,
    UniqueId: folder,
    ServerRelativeUrl: single?.ServerRelativeUrl,
    folders: visibleFolders,
    files: formattedFiles,
    iconProps: {
      iconName: "DocLibrary",
      styles: {
        root: {
          fontSize: 20,
          color: "#106ebe",
        },
      },
    },
    ...single,
  };
}

export async function useHomeFolders() {
  try {
    const webFolders = await sp.web.folders();
    const rootFolder = await sp.web.rootFolder.get();
    const files = await sp.web
      .getFolderByServerRelativeUrl(rootFolder.ServerRelativeUrl)
      .files.get();

    // Get detailed information for each file
    const filesWithDetails = await Promise.all(
      files.map(async (file) => {
        const fileItem = await sp.web.getFileById(file.UniqueId).get();
        const fileSize = fileItem["Size"];
        const modifiedBy = fileItem["ModifiedBy"];

        return {
          ...fileItem,
          fileSize,
          modifiedBy,
        };
      })
    );

    // Get detailed information for each web folder
    const webFoldersWithDetails = await Promise.all(
      webFolders.map(async (folder) => {
        const folderItem = await sp.web.getFolderById(folder.UniqueId).get();
        const folderSize = folderItem["Length"];
        const modifiedBy = folderItem["ModifiedBy"];

        return {
          ...folderItem,
          folderSize,
          modifiedBy,
        };
      })
    );

    const all = [...webFoldersWithDetails, ...filesWithDetails];

    return all;
  } catch (error) {
    console.error("Error fetching folders data:", error);
    throw error;
  }
}

export async function useFileUpload(files) {
  const { file, id } = files;
  const promises = file.map(async (name, index) => {
    try {
      const response = await sp.web
        .getFolderById(id)
        .files.add(name.name, name, true);

      const data = await response;

      return data;
    } catch (err) {
      console.error("Error uploading photo:", err);
      return { status: "rejected", reason: err };
    }
  });

  const result = await Promise.all(promises);

  return result;
}
