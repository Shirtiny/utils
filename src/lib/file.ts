/*
 * @Author: Shirtiny
 * @Date: 2021-11-10 16:47:19
 * @LastEditTime: 2021-11-10 17:06:30
 * @Description:
 */

// 读取文件
const read = (exec: (reader: FileReader) => void): Promise<any> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    exec && exec(reader);
  });
};

const download = (url: string, fileName: string, suffixName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.${suffixName}`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downLoadBlob = (
  blob: Blob | null,
  fileName: string,
  suffixName: string,
) => {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  download(url, fileName, suffixName);
  URL.revokeObjectURL(url);
};

const isSupportFileSystem = () => {
  return !!window.showDirectoryPicker;
};

const downloadToDirectory = async (
  blob: Blob | null,
  fileName: string,
  suffixName: string,
) => {
  if (!isSupportFileSystem() || !blob) return;
  const dirHandle = await window.showDirectoryPicker();
  const fileHandle = await dirHandle.getFileHandle(
    `${fileName}.${suffixName}`,
    { create: true },
  );
  const stream = await fileHandle.createWritable();
  await stream.write(blob);
  await stream.close();
};

const file = {
  read, download,
  downLoadBlob,
  downloadToDirectory,
};

export default file;
