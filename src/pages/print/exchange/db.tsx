import { axios, IAxiosState, DEV } from '@/utils/axios';
import { message } from 'antd';

/**
 * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI string
 * @returns {Blob}
 */
const dataURItoBlob = (dataURI: string) => {
  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export const getFormData = (dataURL: string) => {
  let data = new FormData();
  let blob = dataURItoBlob(dataURL);
  data.append('file', blob);
  return data;
};

export interface ICodeRec {
  /** 标记后的图片 */
  img: string;
  /** 识别号码 */
  code: {
    /** 号码图片 */
    img: string;
    /** 识别号码 */
    code: string;
    /** 实际号码 */
    acc_code: string;
    /** 宽 */
    width: number;
    /** 高 */
    height: number;
    /** 得分 */
    score: number;
    /** 数量 */
    piece: number;
    idx: number;
    isRepeat: boolean;
  }[];
}

/*
   识别图片
   TODO : CORS
  */
export const recPhoto: (data: FormData) => Promise<ICodeRec> = data =>
  axios({
    method: 'POST',
    url: 'http://localhost:5000/',
    data,
  }).catch(e => {
    message.error('请选择图片');
    return;
  });

export interface ICartLog {
  cart_number: string;
  code_head: string;
  captain: string;
  machine_name: string;
  machine_id: string;
  user_code: string;
  username: string;
}
/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 根据车号查询清分机台登录人员列表 }
 */
export const getUdtPpMachineprocess: (cart: string) => Promise<ICartLog[]> = cart =>
  axios({
    url: DEV ? '@/mock/1379_c1f66d3dbb.json' : '/1379/c1f66d3dbb.json',
    params: {
      cart,
    },
  }).then(res => res.data as ICartLog[]);

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 获取兑换1号库库管员名单 }
 */
export const getUdtTbUserloginInfo: () => Promise<{ name: string; value: string }[]> = () =>
  axios({
    url: DEV ? '@/mock/1380_78a9a85a3a.json' : '/1380/78a9a85a3a.json',
  }).then(res => res.data as { name: string; value: string }[]);

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 查询单万产品兑换票记录 }
 */
export const getUdtPsExchange: (cart: string) => Promise<number> = cart =>
  axios({
    url: DEV ? '@/mock/1381_ad931ff212.json' : '/1381/ad931ff212.json',
    params: {
      cart,
    },
  }).then(res => {
    let data = res.data?.[0] || [{ pieces: 0 }];
    return data.pieces as number;
  });

export const getCameraConfig = () => axios({ url: '@/mock/camera_eloam.json' });
