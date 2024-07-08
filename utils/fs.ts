import { BaseDirectory, readBinaryFile } from "@tauri-apps/api/fs";

export const getFileBytes = async (path?: string) => {
  if (!path) return null;
  try {
    const content = await readBinaryFile(path, {
      dir: BaseDirectory.Home,
    });
    return btoa(String.fromCharCode(...content));
  } catch (error) {
    console.log("sth went wrong", error);
    return null;
  }
};

export const getBytesArray = (file: File): Promise<Uint8Array> => {
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
