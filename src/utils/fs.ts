import {
  BaseDirectory,
  createDir,
  copyFile,
  exists,
  writeBinaryFile,
} from "@tauri-apps/api/fs";
import { appDataDir, sep, join } from "@tauri-apps/api/path";

// C:\Users\abdel\AppData\Roaming\whatisthis

export const updateFile = async (path: string, name: string) => {
  if (path.split(sep).length > 1) {
    return await saveFile(path, name);
  }
  return path;
};

export const saveFile = async (path: string, name: string) => {
  if (!path) return "";
  const RightFolder = name === "Image" ? "Images" : "Docs";
  try {
    const fileName = path.split(sep)[path.split(sep).length - 1];
    await createFolder(RightFolder);

    const filePath = await join(await appDataDir(), RightFolder, fileName);

    await copyFile(path, filePath, {
      dir: BaseDirectory.AppData,
    });

    return filePath;
  } catch (error) {
    console.log("sth went wrong", error);
    return "";
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

export const uploadCSVfiles = async ({ file }: { file: File }) => {
  try {
    await createFolder("csv");
    const bytes = (await getBytesArray(file)) as ArrayBuffer;
    const path = await join(await appDataDir(), "csv", file.name);
    console.log(path);
    await writeBinaryFile(path, bytes, {
      dir: BaseDirectory.AppData,
    });
    return path;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const getBytesArray = (file: File) => {
  const fileData = new Blob([file]);
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = () => {
      let arrayBuffer = new Uint8Array(reader.result as ArrayBuffer);
      resolve(arrayBuffer);
    };
  });
};
