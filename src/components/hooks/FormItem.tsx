import React from 'react';
import classnames from 'classnames';
import './FormItem.less';
import { Col } from 'antd';

export interface IFormItemProps {
  /** 子组件宽度 */
  width?: number | string;
  /** 标题 */
  label?: string;
  /** 数据字段 */
  name?: string;
  /** 是否必填 */
  required?: boolean;
  /** 必填项未填时的报错信息 */
  message?: string;
  /** 显示错误 */
  hasError?: boolean;
  /** 字段说明文字 */
  extra?: string | React.ReactNode;
  loading?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  span?: number;
  labelWidth?: number;
  [key: string]: any;
}
export default function FormItem({
  label,
  name,
  required,
  message = '',
  hasError = false,
  extra = null,
  children,
  style = {},
  span = 12,
  width,
  labelWidth = 100,
  ...props
}: IFormItemProps) {
  return (
    <Col span={span}>
      <div
        className={classnames('ant-row ant-form-item', {
          'ant-form-item-has-error': hasError,
          'ant-form-item-with-help': extra,
        })}
        style={style}
        {...props}
      >
        <div className="ant-col ant-form-item-label" style={{ width: labelWidth }}>
          <label htmlFor={name} className={classnames({ ['ant-form-item-required']: required })}>
            {label}
          </label>
        </div>
        <div className="ant-col ant-form-item-control">
          <div className="ant-form-item-control-input">
            <div className="ant-form-item-control-input-content">{children}</div>
          </div>
          {hasError ? (
            <div className="ant-form-item-explain ant-form-item-explain-error">
              <div role="alert">{message}</div>
            </div>
          ) : (
            extra && <div className="ant-form-item-extra">{extra}</div>
          )}
        </div>
      </div>
    </Col>
  );
}
