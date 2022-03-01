import React from 'react';
import styles from './table.less';
import { Table, Skeleton } from 'antd';
import { IAxiosState } from '@/utils/axios';
import * as R from 'ramda';
import { ColumnProps } from 'antd/lib/table';
import Err from '@/components/Err';
import classnames from 'classnames';

const getColumns: <T>(
  e: string[],
  callback?: (e: ColumnProps<T>[]) => ColumnProps<T>[],
  expandColumn?: number[],
) => ColumnProps<T>[] = (header, callback, expandColumn = []) => {
  let res = header.map(title => ({
    title,
    key: title,
    dataIndex: title,
  }));
  if (callback) {
    res = callback(res);
  }
  if (expandColumn.length > 0) {
    res = res.filter((item, idx) => !expandColumn.includes(idx));
  }
  return res;
};

const getData = (data: IAxiosState) =>
  !data.data
    ? []
    : R.clone(data.data).map((item: any, idx) => ({
        ...item,
        _row_: item['id'] || idx,
      }));

export default ({
  data,
  loading,
  columnCallback,
  error,
  className,
  style,
  extra,
  rowSelection,
  onSelect,
  expandColumn = [],
  title,
  showTitle = true,
  size = 'small',
  ...props
}: {
  error?: any;
  data: IAxiosState | null | {};
  loading: boolean;
  columnCallback?: <T>(e: T) => T;
  className?: string;
  style?: React.CSSProperties;
  extra?: React.ReactNode;
  rowSelection?: undefined | 'radio' | 'checkbox';
  onSelect?: (e: any) => void;
  expandColumn?: number[];
  title?: React.ReactNode;
  showTitle?: boolean;
  size?: 'small' | 'middle' | 'large' | undefined;
  [key: string]: any;
}) => {
  if (error) {
    return <Err err={error} />;
  }
  return (
    <div className={classnames(styles.table, className)} style={style}>
      <div className={styles.head}>
        {data && data.title ? (
          showTitle && <h2>{title || data.title}</h2>
        ) : (
          <Skeleton
            active
            loading
            title={{
              style: { height: 40 },
              width: 250,
            }}
          />
        )}
        {extra &&
          (loading ? (
            <Skeleton
              active
              loading
              title={{
                style: { height: 40 },
                width: 160,
              }}
            />
          ) : (
            extra
          ))}
      </div>
      {!data ? (
        <Skeleton active loading style={{ height: 200 }} />
      ) : (
        <Table
          rowSelection={
            rowSelection && {
              type: rowSelection,
              onChange: (_, selectedRows) => {
                onSelect && onSelect(selectedRows);
              },
            }
          }
          loading={loading}
          dataSource={loading ? [] : getData(data)}
          columns={loading ? [] : getColumns(data.header || [], columnCallback, expandColumn)}
          rowKey="_row_"
          size={size}
          expandable={
            expandColumn.length == 0
              ? false
              : {
                  expandedRowRender: record => {
                    let header = R.pick(expandColumn, data.header);
                    return Object.values(header).map((item: string) => (
                      <p style={{ margin: '0 0 0 20px' }} key={item}>
                        {item}: {record[item]}
                      </p>
                    ));
                  },
                }
          }
          {...props}
        />
      )}
    </div>
  );
};
