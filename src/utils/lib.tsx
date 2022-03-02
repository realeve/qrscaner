import * as axios from './axios';
import * as R from 'ramda';
import moment from 'moment';
// 数字
export const isNumOrFloat = (str: any) => /^(-|\+|)\d+(\.)\d+$|^(-|\+|)\d+$/.test(String(str));

export const now = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const weeks = () => moment().weeks();

export const ymd = () => moment().format('YYYYMMDD');

export const getType = axios.getType;

interface Store {
  payload: any;
}
export const setStore = (state: {} | any[], store: Store) => {
  let { payload } = store;
  if (typeof payload === 'undefined') {
    payload = store;
    // throw new Error('需要更新的数据请设置在payload中');
  }
  let nextState = R.clone(state);
  Object.keys(payload).forEach(key => {
    let val = payload[key];
    if (getType(val) == 'object') {
      nextState[key] = Object.assign({}, nextState[key], val);
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};

export const noncer = () =>
  Math.random()
    .toString(16)
    .slice(2);

export let dataURItoBlob = (dataURI: string) => {
  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mimeString,
  });
};

/**
 * wiki: dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI:base64
 * @returns {FormData}
 * 用法： axios({url,type:'POST',data}).then(res=>res.data);
 */
// 将BASE64编码图像转为FormData供数据上传，用法见上方注释。
export let dataURI2FormData = (dataURI: string) => {
  let data = new FormData();
  let blob = dataURItoBlob(dataURI);
  data.append('file', blob);
  return data;
};

export let blob2FormData = (blob: Blob, filename: string) => {
  let data = new FormData();
  let fileOfBlob = new File([blob], filename);
  data.append('file', fileOfBlob);
  return data;
};

export let openFile = (url: string) => {
  var htmlForNewWindow = `<html>
      <style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>
      <body>
        <iframe src="${url}"></iframe>
      </body>
    </html>`;
  var nW = global.open();

  if (nW !== null) {
    nW.document.write(htmlForNewWindow);
  }

  // if (nW || typeof safari === 'undefined') return nW;
};

// 按照每页标签数量将顺序数组转换为二维数组
export const convertTo2DArray = (org: Array<Object>, pageSize: number) => {
  if (!org || org.length === 0 || !pageSize || pageSize <= 0) {
    return [];
  }

  let orgLength = org.length;
  let len = Math.ceil(orgLength / pageSize);
  let arr1 = R.concat(org, R.repeat(undefined, pageSize * len - orgLength));
  // console.info(arr1);
  return R.range(0, len).map(idx => R.range(0, pageSize).map(i => arr1[i * len + idx]));
};
