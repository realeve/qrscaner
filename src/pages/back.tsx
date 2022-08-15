import React, { useState, useEffect, useRef } from 'react';
// import { QrReader, OnResultFunction } from 'react-qr-reader'
import styles from './index.less';
import { Button, message, notification, Input } from 'antd';
import * as db from './db';
import { useDebounce } from 'react-use';
// const cameraCfg = [
//     {
//         width: 4416,
//         height: 3312,
//     },
//     {
//         width: 4208,
//         height: 3120,
//     },
//     {
//         width: 3264,
//         height: 2448,
//     },
//     {
//         width: 2592,
//         height: 1944,
//     },
//     { width: 2048, height: 1536 },
//     { width: 1920, height: 1080 },
//     { width: 1600, height: 1200 },
//     { width: 1280, height: 960 },
//     { width: 1280, height: 720 },
//     { width: 640, height: 480 },
// ];

const recConfig = ['地区', '版本号', '票据代码', '票据号码', '校验码', '开票日期', '金额'];

const keys = ['area', 'version', 'code', 'sn', 'token', 'datename', 'paymount'];

const recConfig2 = [
  '地区',
  '版本号',
  '发票代码',
  '发票号码',
  '金额',
  '开票日期',
  '校验码',
  '验证码',
];
const keys2 = ['area', 'version', 'code', 'sn', 'paymount', 'datename', 'token', 'token2'];

export default () => {
  const ref = useRef(null);

  const [val, setVal] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);

  const [state, setState] = useState('');

  useDebounce(
    () => {
      if (val.length > 0) {
        setState(val);
      }
      setVal('');
    },
    100,
    [val],
  );

  const handleScan = (data: string) => {
    // const data = result?.getText?.()
    if (data.length > 0) {
      let res = data.split(',');
      setResult(res);
    }
  };

  const [isRepeat, setIsRepeat] = useState(false);
  const [checkTime, setCheckTime] = useState('');

  const [count, setCount] = useState(0);

  // useEffect(() => {
  //     setIsRepeat(false)
  //     if (!state) { return }
  //     setCount(count => count + 1)
  //     handleCheck()
  // }, [state])

  useEffect(() => {
    if (val == '') {
      return;
    }
    setIsRepeat(false);
    if (!state) {
      return;
    }
    setCount(count => count + 1);
    handleCheck();
  }, [val]);

  useEffect(() => {
    ref?.current?.focus?.();
    // console.log(ref?.current)
  }, []);

  const handleCheck = async () => {
    if (!state) {
      return;
    }
    let checktime = await db.getCbpcInvoice(state);
    let repeat = typeof checktime == 'string';
    setIsRepeat(repeat);
    if (!repeat) {
      submit();
    }
    setCheckTime(checktime);
    return checktime;
  };

  const submit = async () => {
    if (!state) {
      return;
    }
    let params: { [e: string]: string; qr_code: string } = {
      qr_code: state,
    };
    let qrDetail = state.split(',');
    let keyList = qrDetail.length < 8 ? keys : keys2;
    if (qrDetail.length > 8) {
      qrDetail = qrDetail.slice(0, qrDetail.length - 1);
    }
    qrDetail.forEach((val, key) => {
      params[keyList[key]] = val;
    });

    // console.log(result, keys, params)

    let id = await db.addCbpcInvoice(params).catch(e => {
      return 0;
    });

    if (id) {
      notification.success({
        message: '提交成功，请扫描下一张票据',
        description: `当前票据信息已提交，票据ID为${id}`,
      });
      return;
    }

    message.error('当前票据信息提交失败，请重试');
  };

  return (
    <div className={styles.container}>
      <Input
        size="large"
        ref={ref}
        style={{ height: 100 }}
        value={val}
        onChange={e => {
          setVal(e.target.value);
          handleScan(e.target.value);
        }}
      />

      <div className={styles.result}>
        <h2>识别结果</h2>
        <div className={styles.title}>{state}</div>
        <div className={styles.dot}>{count}</div>
        <ul>
          {(result.length < 8 ? recConfig : recConfig2).map((name, idx) => (
            <li key={name}>
              <div>{name}</div>:<span>{result[idx]}</span>
            </li>
          ))}
          <li style={{ fontSize: 16 }}>
            <div>是否有效</div>:
            <span style={{ color: isRepeat ? 'red' : 'black' }}>
              {isRepeat ? `否，${checkTime} 扫描` : '是'}
            </span>
          </li>
        </ul>
        <Button type="primary" onClick={submit} disabled={!state || isRepeat}>
          确认提交
        </Button>
      </div>
    </div>
  );
};
