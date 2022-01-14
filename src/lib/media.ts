/*
 * @Author: Shirtiny
 * @Date: 2021-12-24 09:31:53
 * @LastEditTime: 2022-01-11 11:39:18
 * @Description:
 */

import file from "./file";

interface IStreamProvider {
  captureStream(frameRate?: number): MediaStream;
}

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("util screenshot canvas的输出为空值"));
      }
      resolve(blob);
    });
  });
};

const screenshotByCanvas = async (
  canvas?: HTMLCanvasElement | null,
  fileName: string = `screenshot_${Date.now()}`,
) => {
  if (!canvas) return;
  try {
    const blob = await canvasToBlob(canvas);
    file.downLoadBlob(blob, fileName, "png");
  } catch (e: any) {
    console.error(e);
  }
};

const screenshot = async (
  videoEl?: HTMLVideoElement | null,
  fileName: string = `screenshot_${Date.now()}`,
) => {
  if (!videoEl) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  canvas
    .getContext("2d")!
    .drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  await screenshotByCanvas(canvas, fileName);
};

const record = (
  element: IStreamProvider,
  fileName: string = `record_${Date.now()}`,
): MediaRecorder | null => {
  const options = { mimeType: "video/webm;codecs=h264" };
  const mediaStream = element.captureStream(25);
  const recordedChunks: Blob[] = [];
  const mediaRecorder = new MediaRecorder(mediaStream, options);
  mediaRecorder.addEventListener("dataavailable", (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      file.downLoadBlob(blob, fileName, "webm");
    }
  });

  try {
    mediaRecorder.start();
  } catch (e) {
    console.error(e);
  }

  return mediaRecorder;
};

const media = {
  canvasToBlob,
  screenshotByCanvas,
  screenshot,
  record,
};

export default media;
