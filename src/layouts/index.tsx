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
};

let menus: IMenu[] = [
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
