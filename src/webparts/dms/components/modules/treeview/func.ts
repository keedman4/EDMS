import {sp} from '@pnp/sp';
import { uniqueId } from 'lodash';

export async function useDocumentLibrary(){
    try {
        const data = await sp.web.folders();
        
        const filterData = data?.map(({Name, UniqueId, ServerRelativeUrl}) => ({
            Name,
            UniqueId,
            ServerRelativeUrl
        }));

        const getChildrenSubFolders = async(folder) =>{
            const folderItem = await sp.web
            .getFolderById(folder?.UniqueId)
            .folders.get();

            const fileItem = await sp.web.getFolderById(folder?.UniqueId).files.get();

        const filterSubFolder = folderItem?.map(
            ({ Name, UniqueId, ServerRelativeUrl }) => ({
                Name,
                UniqueId,
                ServerRelativeUrl
            })
        );

        const filterSubFile = fileItem?.map(
            ({ Name, UniqueId, ServerRelativeUrl }) => ({
                Name,
                UniqueId,
                ServerRelativeUrl
            })
        );
            return {
                Name: folder?.Name,
                UniqueId: folder?.UniqueId,
                ServerRelativeUrl: folder?.ServerRelativeUrl,
                subfolders: filterSubFolder,
                files: filterSubFile
            };
        }

        const getSubFolders = async(folder) => {
               const folderItem = await sp.web
            .getFolderById(folder?.UniqueId)
            .folders.get();

            const fileItem = await sp.web.getFolderById(folder?.UniqueId).files.get();

        const filterSubFolder = folderItem?.map(
            ({ Name, UniqueId, ServerRelativeUrl }) => ({
                Name,
                UniqueId,
                ServerRelativeUrl
            })
        );

        const filterSubFile = fileItem?.map(
            ({ Name, UniqueId, ServerRelativeUrl }) => ({
                Name,
                UniqueId,
                ServerRelativeUrl
            })
        );

        const folderLoop = await Promise.all(filterSubFolder.map(getChildrenSubFolders));

            return {
                Name: folder?.Name,
                UniqueId: folder?.UniqueId,
                ServerRelativeUrl: folder?.ServerRelativeUrl,
                subfolders: folderLoop,//filterSubFolder,
                files: filterSubFile
            };            
        };
    
    const allFolders = await Promise.all(filterData.map(getSubFolders));

    return allFolders;
    } catch (error) {
        throw error(error);
    }
}