/*
 * @Author: Shirtiny
 * @Date: 2021-11-21 22:51:43
 * @LastEditTime: 2021-11-27 11:08:19
 * @Description:
 */

import { file } from "../main";

const read = () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.addEventListener("change", (e) => {
    const files = (e.currentTarget as HTMLInputElement).files || [];
    file
      .read((reader) => {
        reader.readAsText(files[0]);
      })
      .then((s) => {
        console.log("reader:", s);
      });
  });

  document.body.appendChild(fileInput);
};

const fileTest = {
  read,
};

export default fileTest;
