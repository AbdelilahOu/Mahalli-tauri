import { BaseDirectory, createDir, copyFile, exists } from "@tauri-apps/api/fs";
import { appDataDir, sep } from "@tauri-apps/api/path";

export const updateFile = async (path: string, name: string) => {
  if (path.split(sep).length > 1) {
    return await saveFile(path, name);
  }
  return path;
};

export const saveFile = async (path: string, name: string) => {
  const RightFolder = name === "Image" ? "Images" : "Docs";
  try {
    const fileName = path.split(sep)[path.split(sep).length - 1];
    // const fileExtention = fileName.split(".")[1];
    await createFolder(RightFolder);
    await copyFile(
      path,
      (await appDataDir())
        .concat(sep)
        .concat(RightFolder)
        .concat(sep)
        .concat(fileName),
      {
        dir: BaseDirectory.AppData,
      }
    );
    return fileName;
  } catch (error) {
    console.log("sth went wrong", error);
  }
};

const createFolder = async (folder: string) => {
  if (!(await checkIfExistsInFs(folder))) {
    try {
      await createDir(folder, {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      return true;
    } catch (error) {
      console.log("cant create folder");
      return false;
    }
  }
  return true;
};

const checkIfExistsInFs = async (fileOrFolder: string) => {
  try {
    return await exists(fileOrFolder, {
      dir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.log("checing if exist error");
    console.log("err in exists");
  }
};
