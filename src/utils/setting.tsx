export let DEV: boolean = process.env.NODE_ENV === 'test' // || process.env.NODE_ENV === 'development';

// 前台资源部署域名，默认头像图片资源调用域名
export let config = {
  chengdu: {
    api: 'http://10.8.1.25:100',
    uploadHost: 'http://10.8.1.25:100/upload/',
    host: 'http://10.8.2.133:8000',
  },
};

// export const CUR_COMPANY = 'kunshan';

export const CUR_COMPANY = 'chengdu';

let domain: string = config[CUR_COMPANY].api;
// 后台api部署域名
let host = domain;

// 人员信息管理，头像信息上传路径
let uploadHost: string = config[CUR_COMPANY].uploadHost;

if (DEV) {
  // 上传代码时取消此处的判断
  domain = '';
  host = 'http://localhost:90/api/';
  uploadHost = '//localhost:90/public/upload/';
}

let UPLOAD_URL = 'http://10.8.1.25/ftp';
let FTP_DIST = 'ftp://mes.cdyc.cbpm:2001/';
const FTP2HTTP = 'http://mes.cdyc.cbpm:8000/';

export { domain, host, uploadHost, UPLOAD_URL, FTP_DIST, FTP2HTTP };
