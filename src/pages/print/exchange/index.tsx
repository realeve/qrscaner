import React, { useRef, useState } from 'react';
import { useTitle } from 'react-use';
import styles from './index.less';
import { Card, Divider, notification ,message} from 'antd';
import Camera, { ICameraApi } from './camera';
import { ICodeRec, getFormData, recPhoto } from './db';
import RecResult from './RecResult';
import * as R from 'ramda';

export default () => {
  useTitle('检封小张废票兑换系统');
  const ref = useRef<ICameraApi>(null);

  const [rec, setRec] = useState<ICodeRec[]>([]);

  const [prod, setProd] = useState('');

  // 计算数据重复情况
  const refreshCodes = (rec: ICodeRec[]) => {
    let codes = rec.map(item => item.code.map(it => it.code));
    let codeList = R.flatten(codes);
    let codeItems = R.countBy(item => item, codeList); 

    let nextRec = R.clone(rec);
    nextRec = nextRec.map(item => {
      item.code = item.code.map(res => {
        res.isRepeat = codeItems[res.code] > 1;
        return res;
      });
      return item;
    });
    setRec(nextRec);
  };

  const getPhoto = () => {
    let camera = ref?.current;
    if (!camera) {
      return;
    }
    let dataURL = camera.getPhoto();
    if (!dataURL) {
      return;
    }
    let data = getFormData(dataURL);

    recPhoto(data).then(res => {
      if(!res){
        message.error('图片识别失败');
        return;
      }
      res.code = res.code.map(item => {
        item.acc_code = item.code;
        item.piece = 1000;
        return item;
      });

      notification.info({
        message: '识别结果',
        description: `本次共检测到 ${res.code.length} 张号码信息。`,
      });
      let nextRec = [...rec, res];
      refreshCodes(nextRec);
    });
  };

  return (
    <div className={styles.wrap}>
      <Card
        title={<h3 style={{ fontWeight: 'bold' }}>检封小张废票兑换</h3>}
        className={styles.setting}
      >
        <Camera ref={ref} data={rec}/>
        <Divider dashed />
        <h3 style={{ fontWeight: 'bold' }}>识别结果</h3>
        <RecResult
          data={rec}
          prod={prod}
          onChange={setRec}
          getPhoto={getPhoto}
          onRemove={refreshCodes}
        />
      </Card>
    </div>
  );
};
