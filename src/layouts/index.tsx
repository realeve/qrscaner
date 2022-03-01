import React, { useState } from 'react';
import styles from './index.css';
import { useLocation } from 'react-use';
import { Menu, Layout } from 'antd';
import Link from 'umi/link';


const { SubMenu } = Menu;

interface IMenu {
  hash: string;
  title: string;
  children?: IMenu[];
}

export const menuName = {
  '/': '首页',
  '/code/input': '冠字录入',
  '/code/audit': '冠字审核',
  '/code/distribute': '冠字下发',
  '/code/receive': '冠字接收',
  '/code/decode': '冠字分解',
  '/print/smallpack': '千封签',
  '/print/casepack': '封箱签',
  // '/ewm/d': '装箱',
  '/ewm/r': '入成品库',
  '/ewm/c': '解缴',
};

let menus: IMenu[] = [
  {
    hash: '/',
    title: '编码规则',
  },
  {
    title: '冠字管理',
    hash: '/code/input',
    children: [
      {
        title: '1.冠字录入',
        hash: '/code/input',
      },
      {
        title: '2.冠字审核',
        hash: '/code/audit',
      },
      {
        title: '3.冠字下发',
        hash: '/code/distribute',
      },
      {
        title: '4.冠字接收',
        hash: '/code/receive',
      },
      {
        title: '5.冠字分解',
        hash: '/code/decode',
      },
      // {
      //   title: '6.冠字核对',
      //   hash: '/code/check1',
      //   children: [
      //     {
      //       title: '一核',
      //       hash: '/code/check1',
      //     },
      //     {
      //       title: '二核',
      //       hash: '/code/check2',
      //     },
      //     {
      //       title: '三核',
      //       hash: '/code/check3',
      //     },
      //   ],
      // },
      // {
      //   title: '7.印码通知单管理',
      //   hash: '/code/notice',
      // },
      // {
      //   title: '号单',
      //   hash: '/code/paper',
      // },
    ],
  },
  {
    title: '千封签',
    hash: '/print/smallpack',
  },
  {
    title: '封箱签',
    hash: '/print/casepack',
  },
  {
    title: '装箱二维码',
    hash: '/ewm/d',
    children: [
      { title: '装箱', hash: '/ewm/d' },
      { title: '入成品库', hash: '/ewm/r' },
      { title: '解缴', hash: '/ewm/c' },
    ],
  },
  {
    title: '异地解缴入库',
    hash: '/print/note_sheet',
  },
  {
    title: '检封小张废票兑换',
    hash: '/print/exchange',
  },
];

const BasicLayout: React.FC = ({ children }) => {
  const param = useLocation();
  if (param.hash?.includes('#/print/code')) {
    return children;
  }
  const isSmallPack =
    param.hash?.includes('/print/smallpack') ||
    param.hash?.includes('/print/casepack') ||
    param.hash?.includes('/print/note_sheet') ||
    param.hash?.includes('/print/exchange');
  if (isSmallPack) {
    return <div className={styles.white}>{children}</div>;
  }
  return (
    <div className={styles.white}>
      <Layout.Header
        style={{
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Menu mode="horizontal" theme="dark" selectedKeys={param.hash.slice(2)}>
          {menus.map(item =>
            !item.children ? (
              <Menu.Item key={item.hash.slice(1)}>
                <Link to={item.hash}>{item.title}</Link>
              </Menu.Item>
            ) : (
              <SubMenu title={item.title} key={item.hash.slice(1)}>
                {item.children.map(subItem =>
                  !subItem.children ? (
                    <Menu.Item key={subItem.hash.slice(1)}>
                      <Link to={subItem.hash}>{subItem.title}</Link>
                    </Menu.Item>
                  ) : (
                    <SubMenu title={subItem.title} key={subItem.hash.slice(1)}>
                      {(subItem.children || []).map(subItem2 => (
                        <Menu.Item key={subItem2.hash.slice(1)}>
                          <Link to={subItem2.hash}>{subItem2.title}</Link>
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  ),
                )}
              </SubMenu>
            ),
          )}
        </Menu>

      </Layout.Header>
      {children}
    </div>
  );
};

export default BasicLayout;
