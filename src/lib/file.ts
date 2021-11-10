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

const file = {
  read,
};

export default file;
