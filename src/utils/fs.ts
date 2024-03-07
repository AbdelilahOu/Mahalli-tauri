import {
  BaseDirectory,
  createDir,
  copyFile,
  exists,
  writeBinaryFile,
  removeDir,
  readDir,
  removeFile,
} from "@tauri-apps/api/fs";
import { appDataDir, sep, join } from "@tauri-apps/api/path";
import { error } from "tauri-plugin-log-api";
// C:\Users\abdel\AppData\Roaming\whatisthis

export const saveFile = async (path: string, name: string) => {
  if (!path) return "";
  const RightFolder = name === "Image" ? "Images" : "Docs";
  try {
    // get the file name
    const fileName = path.split(sep)[path.split(sep).length - 1];
    // create images folder
    await createFolder(RightFolder);
    // get final path of the image
    const filePath = await join(await appDataDir(), RightFolder, fileName);
    // copy the image to images folder
    await copyFile(path, filePath, {
      dir: BaseDirectory.AppData,
    });
    // return file path
    return filePath;
  } catch (error) {
    console.log("sth went wrong", error);
    return "";
  }
};

const createFolder = async (folder: string) => {
  // check if folder exists
  if (!(await checkIfExistsInFs(folder))) {
    try {
      // create the folder
      await createDir(folder, {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      // return true
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
    // return true or false based on the existsence of the ....
    return await exists(fileOrFolder, {
      dir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.log("checing if exist error");
    console.log("err in exists");
    return false;
  }
};

export const uploadCSVfiles = async ({ file }: { file: File }) => {
  try {
    // create folder
    await createFolder("csv");
    // read the file
    const bytes = (await getBytesArray(file)) as ArrayBuffer;
    // get final path
    const path = await join(await appDataDir(), "csv", file.name);
    // write the file into the final path
    await writeBinaryFile(path, bytes, {
      dir: BaseDirectory.AppData,
    });
    // return final path
    return path;
  } catch (err: any) {
    error("Error creating client : " + err.error);
  }
};

export const uploadImagefiles = async (file: File) => {
  try {
    // create folder
    await createFolder("tempo");
    // read the file
    const bytes = (await getBytesArray(file)) as ArrayBuffer;
    // get final path
    const path = await join(await appDataDir(), "tempo", file.name);
    // write the file into the final path
    await writeBinaryFile(path, bytes, {
      dir: BaseDirectory.AppData,
    });
    // return final path
    return path;
  } catch (err: any) {
    console.log(err);
    return "";
  }
};

export const deleteTempFolder = async () => {
  try {
    // delete all the files inside tempo folder
    const files = await readDir("tempo", {
      dir: BaseDirectory.AppData,
    });
    for await (const file of files) {
      await removeFile(file.path, {
        dir: BaseDirectory.AppData,
      });
    }
    // delete the folder
    removeDir("tempo", {
      dir: BaseDirectory.AppData,
    });
  } catch (err: any) {
    console.log(err);
  }
};

const getBytesArray = (file: File) => {
  //
  const fileData = new Blob([file]);
  //
  return new Promise((resolve) => {
    //
    const reader = new FileReader();
    //
    reader.readAsArrayBuffer(fileData);
    //
    reader.onload = () => {
      const arrayBuffer = new Uint8Array(reader.result as ArrayBuffer);
      resolve(arrayBuffer);
    };
  });
};
