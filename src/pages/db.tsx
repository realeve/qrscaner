import { axios, _commonData } from '@/utils/axios';

/**
 *   @database: { 微信开发 }
 *   @desc:     { 写入发票信息 }  
 */
export const addCbpcInvoice: (params: {
    area: string;
    version: string;
    code: string;
    sn: string;
    token: string;
    datename: string;
    paymount: string;
    qr_code: string;
}) => Promise<number> = params => axios({
    url: '/437/92a3fd3c20.json',
    params,
}).then(({
    data: [{
        id
    }]
}) => id);


/**
 *   @database: { 微信开发 }
 *   @desc:     { 查询发票 } 
 */
export const getCbpcInvoice = (qr_code: string) => axios({
    url: '/438/9a336b7eb9.json',
    params: {
        qr_code
    },
}).then(res => res.data[0]?.rec_time as string | undefined);