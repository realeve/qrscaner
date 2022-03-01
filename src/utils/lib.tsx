import * as axios from './axios';
import * as R from 'ramda';
import moment from 'moment';
// 数字
export const isNumOrFloat = (str: any) => /^(-|\+|)\d+(\.)\d+$|^(-|\+|)\d+$/.test(String(str));

export const now = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const weeks = () => moment().weeks();

export const ymd = () => moment().format('YYYYMMDD');
export const isGZ = (str: any) => /^[A-Z](|\d+)(|[A-Z])(|\d+)$/.test(String(str));
export const isNRB = (str: any) => /^[A-Z](|[1-9]|[1-9]\d|100)$/.test(String(str));
export const isCart = (str: string) => /^[0-9]\d{3}[A-Za-z]\d{3}(|[a-bA-B])$/.test(str);

// 获取开数
export const getPercentage = (prodname: string) => {
  prodname = String(prodname || '');
  if (prodname.includes('9602') || prodname.includes('9603')) {
    return 40;
  }
  return 35;
};

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
export const convertToChinaNum = (num: string | number = '') => {
  var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
  var arr2 = new Array(
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
  ); //可继续追加更高位转换值
  if (!num) {
    return '零';
  }
  var english = num.toString().split('');
  var result = '';
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i; //倒序排列设值
    result = arr2[i] + result;
    var arr1_index = english[des_i];
    result = arr1[Number(arr1_index)] + result;
  } //将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十'); //合并中间多个零为一个零
  result = result.replace(/零+/g, '零'); //将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万'); //将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿'); //移除末尾的零
  result = result.replace(/零+$/, ''); //将【零一十】换成【零十】 //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十 //将【一十】换成【十】
  result = result.replace(/^一十/g, '十');
  return result;
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
