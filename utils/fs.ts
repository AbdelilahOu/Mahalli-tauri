import {
  BaseDirectory,
  createDir,
  exists,
  writeBinaryFile,
  readBinaryFile,
} from "@tauri-apps/api/fs";
import { appDataDir, join } from "@tauri-apps/api/path";
import { error } from "tauri-plugin-log-api";

const createFolder = async (folder: string) => {
  if (!(await checkIfExistsInFs(folder))) {
    try {
      await createDir(folder, {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      return true;
    } catch (err: any) {
      error("CANT CREATE FOLDER :" + err);
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
  } catch (err: any) {
    error("ERROR CHECKING IF EXISTS :" + err);
    return false;
  }
};

export const uploadFileToDataDir = async (
  folder: string,
  bytes: ArrayBuffer,
  name: string
) => {
  try {
    await createFolder(folder);
    const path = await join(await appDataDir(), folder, name);
    await writeBinaryFile(path, bytes, {
      dir: BaseDirectory.AppData,
    });
    return path;
  } catch (err: any) {
    return null;
    error("ERROR UPLOADING FILE TO APP DATA DIR : " + err);
  }
};

export async function getFileBytes(path?: string) {
  if (!path) return null;
  try {
    const content = await readBinaryFile(path, {
      dir: BaseDirectory.Home,
    });
    return content;
  } catch (err: any) {
    error("ERROR READING BINARY FILE :" + err);
    return null;
  }
}

export function getBytesArray(file: File): Promise<Uint8Array> {
  const fileData = new Blob([file]);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = () => {
      const arrayBuffer = new Uint8Array(reader.result as ArrayBuffer);
      resolve(arrayBuffer);
    };
  });
}
