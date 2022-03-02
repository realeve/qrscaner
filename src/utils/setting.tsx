export let DEV: boolean = process.env.NODE_ENV === 'test' // || process.env.NODE_ENV === 'development';

let domain: string = '//api.cbpc.ltd/';
// 后台api部署域名
let host = domain;

export { domain, host };
