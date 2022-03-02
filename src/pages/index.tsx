import React, { useState, useEffect } from 'react'
import { QrReader, OnResultFunction } from 'react-qr-reader'
import styles from './index.less'
import { Button, message, notification } from 'antd'
import * as db from './db'
const cameraCfg = [
    {
        width: 4416,
        height: 3312,
    },
    {
        width: 4208,
        height: 3120,
    },
    {
        width: 3264,
        height: 2448,
    },
    {
        width: 2592,
        height: 1944,
    },
    { width: 2048, height: 1536 },
    { width: 1920, height: 1080 },
    { width: 1600, height: 1200 },
    { width: 1280, height: 960 },
    { width: 1280, height: 720 },
    { width: 640, height: 480 },
];
const recConfig = ['地区', '版本号', '票据代码', '票据号码', '校验码', '开票日期', '金额']
const keys = ['area', 'version', 'code', 'sn', 'token', 'datename', 'paymount']
export default () => {
    const [state, setState] = useState<string | undefined>(undefined)
    const [result, setResult] = useState<string[]>([])
    const handleScan: OnResultFunction = (result) => {
        const data = result?.getText?.()
        if (data) {
            setState(data)
            let res = data.split(',')
            setResult(res)
        }
    }

    const [isRepeat, setIsRepeat] = useState(false)
    const [checkTime, setCheckTime] = useState('')

    const [count, setCount] = useState(0)

    useEffect(() => {
        setIsRepeat(false)
        if (!state) { return }
        setCount(count => count + 1)
        handleCheck()
    }, [state])

    const handleCheck = async () => {
        if (!state) { return }
        let checktime = await db.getCbpcInvoice(state)
        let repeat = typeof (checktime) == 'string';
        setIsRepeat(repeat)
        if (!repeat) {
            submit()
        }
        setCheckTime(checktime)
        return checktime
    }

    const submit = async () => {
        if (!state) {
            return;
        }
        let params: { [e: string]: string; qr_code: string; } = {
            qr_code: state,
        }
        result.forEach((val, key) => {
            params[keys[key]] = val
        })
        let id = await db.addCbpcInvoice(params).catch(e => {
            return 0;
        })
        if (id) {
            notification.success({
                message: '提交成功，请扫描下一张票据',
                description: `当前票据信息已提交，票据ID为${id}`
            })
            return;
        }
        message.error('当前票据信息提交失败，请重试')
    }

    return (
        <div className={styles.container}>
            <QrReader
                scanDelay={1000}
                className={styles.qr}
                onResult={handleScan}
                constraints={{
                    ...cameraCfg[4],
                    aspectRatio: 16 / 9
                }}
            />
            <div className={styles.result}>
                <h2>识别结果</h2>
                <div className={styles.title}>
                    {state}
                </div>
                <div className={styles.dot}>{count}</div>
                <ul>
                    {recConfig.map((name, idx) => <li key={name}><div>{name}</div>:<span>{result[idx]}</span></li>)}
                    <li style={{ fontSize: 16 }}><div>是否有效</div>:<span style={{ color: isRepeat ? 'red' : 'black' }}>{isRepeat ? `否，${checkTime} 扫描` : '是'}</span></li>
                </ul>
                <Button type="primary" onClick={submit} disabled={!state || isRepeat}>确认提交</Button>
            </div>
        </div>
    )

} 
