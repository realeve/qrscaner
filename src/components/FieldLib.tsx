import React from 'react';
import { SyncValidateResponse } from '@formily/antd';
import { Input } from 'antd';
import NepalInput, { initStr } from '@/components/NepalInput';
import styles from './FieldLib.less';
import classnames from 'classnames';

export const FormLayoutStyle = {
  labelWidth: 80,
  full: true,
  grid: true,
  columns: 4,
  autoRow: true,
};

export interface IFieldProps {
  type: string;
  name: string;
  title: string;
  enum: (string | { label: string; value: string })[];
  xMegaProps: {};
  xProps: {};
  xRules: SyncValidateResponse;
  required: boolean;
  [key: string]: any;
}

// 自定义 Formily组件
export const AlphaComponent = (props: {
  showAll?: boolean;
  value?: string;
  onChange?: (e: string) => void;
}) => (
  <NepalInput
    validStr={props.showAll ? false : initStr}
    value={props.value || ''}
    needCopy={false}
    onClick={(e: string) => {
      props.onChange && props.onChange((props.value || '') + e);
    }}
  />
);

/**
 *
 * @param props 梵语输入
 */
export const XInput = props => (
  <div className={styles.container}>
    <label className={classnames('nepal', styles.label)} style={{ fontSize: 30 }}>
      {props.value}
    </label>
    <Input {...props} size="large" />
  </div>
);

export const FieldInput = props => (
  <div className={styles.container}>
    <Input {...props} />
    <label style={{ fontSize: 13 }}>{props.block}</label>
  </div>
);

/**
 *
 * @param props 券别输入
 */
export const NoteInput = ({ notes = [], len = 1, ...props }) => (
  <div className={styles.note_container}>
    <Input {...props} />
    <div className={styles.notes}>
      {notes.map(item => (
        <div
          key={item}
          className={styles.item}
          onClick={() => {
            if (props.onChange) {
              if (len == 1) {
                props.onChange(item);
              } else if ((props.value || '').length < len) {
                props.onChange((props.value || '') + item);
              }
            }
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export const renderNepal = (str: string) => (
  <div style={{ fontSize: 18 }}>
    <div className="nepal" style={{ fontSize: 32, lineHeight: '24px', letterSpacing: '-3px' }}>
      {String(str)}
    </div>
    {String(str)}
  </div>
);
