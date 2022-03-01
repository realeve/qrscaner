import React, { useState } from 'react'
import { QrReader, OnResultFunction } from 'react-qr-reader'
import styles from './index.less'

export default () => {
    const [state, setState] = useState('No result')
    const handleScan: OnResultFunction = (result, e) => {
        const data = result?.getText?.()
        setState(data || 'No result')
        console.log(data)

    }

    return (
        <div className={styles.container}>
            <QrReader
                scanDelay={2000}
                className={styles.qr}
                onResult={handleScan}
            />
            <div className={styles.result}>
                {state}
            </div>
        </div>
    )

} 
