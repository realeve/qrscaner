import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Select, Button, message } from 'antd';
import styles from './index.less';
import { saveAs } from 'file-saver';

import useSelect from '@/components/hooks/useSelect';
import classnames from 'classnames';
import * as db from './db';
import * as R from 'ramda';

const { Option } = Select;

export interface ICameraApi {
  /** 获取 Camera 组件中的一张图片，以Base64形式返回 */
  getPhoto: () => string | undefined;
}

const saveCfg = (val: string, key: string = 'camera_rotate') => {
  window.localStorage.setItem(key, val);
};
const getCfg = (key: string = 'camera_rotate') => {
  let val = window.localStorage.getItem(key) || '0';
  return Number(val);
};

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

const Camera = forwardRef<ICameraApi, { data: db.ICodeRec[] }>(({ data }, ref) => {
  const [cameraConfig, setCameraConfig] = useState(cameraCfg);
  useEffect(() => {
    db.getCameraConfig().then(setCameraConfig);
  }, []);
  const [playing, setPlaying] = useState(false);

  const vRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ratio, setRatio] = useState(3);

  const [RotateDeg, rotate] = useSelect<number>({
    data: [
      {
        value: -90,
        name: '向左',
      },
      {
        value: 0,
        name: '不旋转',
      },
      {
        value: 90,
        name: '向右',
      },
    ],
    defaultValue: getCfg('camera_rotate'),
    type: 'radioButton',
  });

  const initCamera = config => {
    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        // 首先，如果有getUserMedia的话，就获得它
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // 否则，为老的navigator.getUserMedia方法包裹一个Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    let v = vRef.current;
    let promise = navigator.mediaDevices.getUserMedia(config);
    return promise
      .then(stream => {
        if (null == v) {
          return;
        }

        console.log('变更分辨率');
        // 旧的浏览器可能没有srcObject
        if ('srcObject' in v) {
          v.srcObject = stream;
        } else {
          // 防止再新的浏览器里使用它，应为它已经不再支持了
          v.src = window.URL.createObjectURL(stream);
        }
        v.onloadedmetadata = function (e) {
          v.play();
          setPlaying(true);
        };
      })
      .catch(err => {
        console.error(err.name + ': ' + err.message);
      });
  };

  const updateVideo = async () => {
    const constraints = {
      video: cameraConfig[ratio],
      audio: false,
    };
    await initCamera(constraints);
    // loop();
  };

  useEffect(() => {
    updateVideo();
  }, [ratio]);

  const getWebcam = () => {
    if (!playing) {
      message.error('相机尚未初始化');
      return;
    }
    let canvas = canvasRef.current;
    let video = vRef.current;
    if (!canvas || !video) {
      message.error('图片获取失败');
      return;
    }
    if (!rotate) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    } else {
      canvas.width = video.videoHeight;
      canvas.height = video.videoWidth;
    }

    let context = canvas.getContext('2d');
    if (rotate) {
      rotate > 0 && context?.translate(canvas.width, 0);
      rotate < 0 && context?.translate(0, canvas.height);
      context?.rotate(Math.PI * (rotate / 180));
    }
    context?.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpg');
  };

  const takePhoto = () => {
    let data = getWebcam();
    if (!data) {
      return;
    }
    saveAs(data, new Date().valueOf() + 'test.jpg');
  };

  useImperativeHandle(ref, () => {
    return { getPhoto: getWebcam };
  });

  useEffect(() => {
    saveCfg(rotate + '', 'camera_rotate');
  }, [rotate]);

  return (
    <div className={styles.camera}>
      <div className={styles.action}>
        <div>
          分辨率：
          <Select value={ratio} onChange={setRatio} className={styles.select}>
            {cameraConfig.map((item, idx) => (
              <Option value={idx} key={item.width + 'x' + item.height}>
                {item.width + ' × ' + item.height}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <RotateDeg />
          <Button
            type="primary"
            onClick={takePhoto}
            style={{ marginLeft: 5 }}
            title="高拍仪推荐型号：良田S1680AF"
          >
            手工拍照
          </Button>
        </div>
      </div>
      <div className={styles.main} style={{ height: rotate ? 600 : 'auto' }}>
        <video
          ref={vRef}
          className={classnames({
            [styles.rotate]: rotate == 0,
            [styles.rotateLeft]: rotate == -90,
            [styles.rotateRight]: rotate == 90,
          })}
        ></video>

        {data.length > 0 && (
          <div className={styles.mainImg}>
            <img src={R.last(data)?.img} style={{ width: '100%' }} alt="识别结果" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{ display: 'none', width: 800, height: 1.25 * 800 }}
        ></canvas>
      </div>
    </div>
  );
});

export default Camera;
