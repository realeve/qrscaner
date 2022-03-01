import React from 'react';
import styles from './index.less';

export default ({ title, children, ...props }) => (
  <div className={styles.fields} {...props}>
    <div className={styles.title}>{title}</div>
    {children}
  </div>
);
