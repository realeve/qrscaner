import React, { useState, useEffect, useMemo } from 'react';
import { Select, Radio, Checkbox, Cascader, Spin, Skeleton } from 'antd';
import { SelectProps } from 'antd/lib/select';
import FormItem, { IFormItemProps } from './FormItem';
import styles from './FormItem.less';
import renderEmpty from 'antd/lib/config-provider/renderEmpty';
const { Option, OptGroup } = Select;
declare type RawValue = string | number | { [key: string]: any };

type TSelectGroup = { group: string; data: { value: string; name: string }[] }[];
type TSelect = { name: string; value: RawValue; dept_name?: string }[];

import { axios } from '@/utils/axios';

export interface ISelectProp<T extends RawValue[] | RawValue>
  extends Omit<SelectProps<number>, 'defaultValue'>,
  Omit<IFormItemProps, 'children' | 'label'> {
  /** 下拉选项列表 */
  data?: TSelect | TSelectGroup;
  /** 值 */
  defaultValue?: T;
  title?: string;
  /** 类型 */
  type?: 'select' | 'radio' | 'radioButton' | 'checkbox' | 'cascader' | 'selectGroup';
  [key: string]: any;
}

export type TFilterOption = (
  val: string,
  {
    option_item: option,
  }: {
    option_item: IRtxUsers;
  },
) => boolean;

type TSelectComponent = (params: {
  name?: string;
  width?: number | string;
  placeholder?: string;
  title?: string;
  filterOption?: TFilterOption;
  loading?: boolean;
  [x: string]: any;
}) => JSX.Element;

type TFormItem = ({
  name,
  message,
  extra,
  required,
  width,
  ...restProps
}: IFormItemProps) => JSX.Element;

type TUseSelect = <T extends RawValue | RawValue[]>(
  params: ISelectProp<T>,
) => [TFormItem | TSelectComponent, T, (e: T) => void];

const handleDataList = (data: string[] | TSelect) => {
  if (typeof data[0] != 'string') {
    return data as TSelect;
  }
  return data.map(name => ({ name, value: name }));
};

const useSelect: TUseSelect = ({
  data = [],
  defaultValue = null,
  title: baseTitle = null,
  disabled = false,
  hasError = false,
  type = 'select',
  /** 选择项初始化url */
  initUrl = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(data);
  const [title, setTitle] = useState(baseTitle);

  useEffect(() => {
    if (data.length == 0) {
      return;
    }
    setState(data);
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (!initUrl) {
      return;
    }
    setLoading(true);
    baseTitle && !title && setTitle(baseTitle); //使用传入的title
    let url = typeof initUrl == 'string' ? { url: initUrl } : initUrl;
    axios<{ name: string; value: RawValue; dept_name?: string }>(url)
      .then(res => {
        setState(handleDataList(res.data));
        !baseTitle && res.title && setTitle(res.title);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [JSON.stringify(state)]);

  const SelectComponent: TSelectComponent = ({
    name = null,
    width = 170,
    placeholder = '点击选择',
    title,
    filterOption,
    size = 'small',
    ...restProps
  }) =>
    useMemo(() => {
      const props = {
        disabled,
        value,
        style: { width },
        placeholder: typeof title === 'string' ? placeholder + (title || '') : placeholder,
        id: name || title,
        size,
        ...restProps,
      };

      switch (type) {
        case 'radio':
          return (
            <Radio.Group
              {...props}
              onChange={e => {
                setValue(e.target.value);
              }}
            >
              {(state as TSelect).map(item => (
                <Radio key={item.value} value={item.value}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>
          );
        case 'radioButton':
          return (
            <Radio.Group
              {...props}
              onChange={e => {
                setValue(e.target.value);
              }}
            >
              {(state as TSelect).map(item => (
                <Radio.Button key={item.value} value={item.value}>
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          );
        case 'checkbox':
          return (
            <Checkbox.Group {...props} onChange={setValue}>
              {(state as TSelect).map(item => (
                <Checkbox key={item.value} value={item.value}>
                  {item.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          );
        case 'cascader':
          return (
            <Cascader
              {...props}
              options={state}
              value={value}
              onChange={setValue}
              placeholder={placeholder}
            />
          );
        case 'selectGroup':
          return (
            <Select {...props} filterOption={filterOption} onChange={setValue}>
              {(state as TSelectGroup).map(groupItem => (
                <OptGroup label={groupItem.group} key={groupItem.group}>
                  {groupItem.data.map(item => (
                    <Option key={item.value} value={item.value} optionItem={item}>
                      {item.name}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          );
        case 'select':
        default:
          return (
            <Select {...props} filterOption={filterOption} onChange={setValue}>
              {state.map(item => (
                <Option key={item.value} value={item.value} option_item={item}>
                  <div className={styles.row}>
                    <span>{item.name}</span>
                    <span style={{ color: '#999' }}>{item.dept_name && `(${item.dept_name})`}</span>
                  </div>
                </Option>
              ))}
            </Select>
          );
      }
    }, [type, disabled, value]);

  if (!title) {
    return [SelectComponent, value, setValue];
  }

  return [
    ({
      name,
      message = null,
      extra = null,
      required = false,
      width = 175,
      style = {},
      span = 12,
      ...restProps
    }: IFormItemProps) => (
      <FormItem
        label={title}
        name={name}
        required={required}
        hasError={hasError}
        message={message}
        extra={extra}
        style={style}
        span={span}
      >
        <Skeleton active loading={loading} paragraph={{ rows: 1 }}>
          <SelectComponent
            width={width}
            name={name}
            title={title}
            {...restProps}
            notFoundContent={restProps.loading ? <Spin spinning /> : renderEmpty('Select')}
          />
        </Skeleton>
      </FormItem>
    ),
    value,
    setValue,
  ];
};

export default useSelect;
