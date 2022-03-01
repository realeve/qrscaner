import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { ICodeRec } from './db';
import { Input, Divider, Row, Button, Col, message, Tag, Modal } from 'antd';
import classnames from 'classnames';
import * as R from 'ramda';

import useSelect from '@/components/hooks/useSelect';
import FormItem from '@/components/hooks/FormItem';
import { useSetState } from 'react-use';
import * as lib from '@/utils/lib';
import * as db from './db';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const getProd = (cart: string) => {
  let prodStr = cart.substr(2, 2);
  switch (prodStr) {
    case '10':
      return 'NRB10';
    case '25':
      return '9602T';
    case '35':
      return '9603T';
    case '45':
      return '9604T';
    case '55':
      return '9605T';
    case '65':
      return '9606T';
    case '75':
    default:
      return '9607T';
  }
};

export default ({
  data,
  onChange,
  prod,
  getPhoto,
  onRemove,
}: {
  data: ICodeRec[];
  onChange: (e: ICodeRec[]) => void;
  prod: string;
  getPhoto: () => void;
  onRemove: (e:ICodeRec[]) => void;
}) => {
  const [total, setTotal] = useState(0);

  const updateTotal = (data:ICodeRec[])=>{
    if (data.length == 0) {
      return;
    }
    let code = R.flatten(R.map(item => item.code, data));
    let nums = R.pluck('piece', code);
    setTotal(R.sum(nums));
  }

  useEffect(() => {
    updateTotal(data)
  }, [data]);

  const [ProdType, prod_name, setProdName] = useSelect<string>({
    initUrl: './base/prod.json',
    defaultValue: '',
  });

  const [state, setState] = useSetState({
    cart_number: '',
    piece: 0,
    code_head: '', // 冠字
    machine_id: '',
    machine_name: '',
    captain: '',
    receive_user: '',
    storage_user: '',
  });

  const [users, setUsers] = useState<{ name: string; value: string }[]>([]);
  const [storageUsers, setStorageUsers] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    db.getUdtTbUserloginInfo().then(setStorageUsers);
  }, []);

  useEffect(() => {
    if (!lib.isCart(state.cart_number)) {
      return;
    }
    setState({
      code_head: '', // 冠字
      machine_id: '',
      machine_name: '',
      captain: '',
      storage_user: '',
      receive_user: '',
    });
    setUsers([]);
    db.getUdtPsExchange(state.cart_number).then(piece => {
      setState({ piece });
    });
    db.getUdtPpMachineprocess(state.cart_number).then(cartLogs => {
      if (cartLogs.length == 0) {
        message.error('生产信息查询无数据');
        return;
      }
      let baseInfo = cartLogs[0];
      setState({
        code_head: baseInfo.code_head, // 冠字
        machine_id: baseInfo.machine_id,
        machine_name: baseInfo.machine_name,
        captain: baseInfo.captain,
      });
      let nextUsers = cartLogs.map(item => ({ name: item.username, value: item.user_code }));
      setUsers(nextUsers);
    });

    let prod_name = getProd(state.cart_number);
    if (prod != '无产品' && prod_name !== prod) {
      message.error('产品品种可能不一致，请检查');
    }
    setProdName(prod_name);
  }, [state.cart_number]);

  const submit = () => {
    let codeParam = data;
    let params = {
      prod: prod_name,
      ...state,
    };
    // TODO 此处在data中，移除 code的内容为空，length===0的项，不提交至后端
    console.log(codeParam, params);
  };

  const reset = () => {
    setState({ cart_number: '', piece: 0 });
    setState({
      code_head: '', // 冠字
      machine_id: '',
      machine_name: '',
      captain: '',
      storage_user: '',
      receive_user: '',
    });

    setProdName('');
    onChange([]);
  };
  return (
    <div className={styles.result}>
      <ul>
        <li>
          <span>编号</span>
          <div>号码图片</div>
          <div>识别印码号</div>
          <label>宽(像素)</label>
          <label>高</label>
          <label>正确率</label>
          <div>实际号码</div>
          <div>数量（小开）</div>
        </li>
        {data.length > 0 &&
          data.map((groupItem, groupIdx) => (
            <>
              {groupItem.code.map((item, id) => (
                <li key={item.code} className={classnames({ [styles.repeat]: item.isRepeat })}>
                  <span>{id + 1}</span>
                  <div>
                    <img src={item.img} alt={item.code} />
                  </div>
                  <div className={classnames({ [styles.error]: item.code !== item.acc_code })}>
                    {item.code}
                  </div>
                  <label>{item.width.toFixed(0)}</label>
                  <label>{item.height.toFixed(0)}</label>
                  <label>{(item.score * 100).toFixed(2)}%</label>
                  <div>
                    <Input
                      placeholder="实际号码"
                      value={item.acc_code}
                      maxLength={10}
                      minLength={8}
                      style={{ width: 140 }}
                      onChange={e => {
                        let nextVal = e.target.value;
                        let nextState = R.clone(data);
                        let code = nextState[groupIdx].code[id];
                        code.acc_code = nextVal;
                        onChange(nextState);
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="小开数量"
                      value={item.piece}
                      type="number"
                      min={1}
                      max={1000}
                      style={{ width: 100 }}
                      onChange={e => {
                        let nextVal = Number(e.target.value);
                        let nextState = R.clone(data);
                        let code = nextState[groupIdx].code[id];
                        code.piece = nextVal;
                        onChange(nextState);
                      }}
                    />
                  </div>
                </li>
              ))}
              {groupItem.code.length > 0 && (
                <li style={{ position: 'relative' }}>
                  <Button
                    type="dashed"
                    style={{
                      position: 'absolute',
                      background: '#f14848',
                      color: '#fff',
                      right: 0,
                      bottom: 40,
                    }}
                    onClick={() => {
                      confirm({
                        icon: <QuestionCircleOutlined />,
                        content:
                          '是否确认删除本组识别结果？当识别号码数量不足时，建议删除后重新识别。',
                        onOk() {
                          let nextData = R.remove(groupIdx, 1, data);
                          onChange(nextData);
                          onRemove(nextData);
                          updateTotal(nextData)
                        },
                        okText: '确定删除',
                        cancelText: '取消',
                      });
                    }}
                  >
                    移除本次识别结果
                  </Button>
                  <Divider dashed />
                </li>
              )}
            </>
          ))}
      </ul>
      <div style={{ textAlign: 'right' }}>
        合计：<span style={{ fontWeight: 'bold' }}>{total}</span>
        <sub>(小张)</sub>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button style={{ marginTop: 10 }} type="primary" onClick={getPhoto}>
          识别号码
        </Button>
      </div>
      <Divider dashed />
      <Row gutter={16}>
        <FormItem label="车号" span={8}>
          <Input
            placeholder="车号"
            value={state.cart_number}
            onChange={e => {
              setState({ cart_number: e.target.value });
            }}
            onBlur={() => {
              if (state.cart_number.length == 0) {
                message.error('车号信息必须录入');
                return;
              }
              if (!lib.isCart(state.cart_number)) {
                message.error('车号格式不正确');
              }
            }}
          />
        </FormItem>
        <FormItem label="兑换张数" span={8}>
          <Input
            placeholder="兑换张数"
            value={state.piece}
            onChange={e => {
              setState({ piece: Number(e.target.value) });
            }}
            min={1}
            max={400000}
            type="number"
          />
        </FormItem>
        <FormItem
          label="库管员"
          span={8}
          extra={
            <div style={{ margin: '5px 0' }}>
              有效人员：
              {storageUsers.map(item => (
                <Tag color="blue" key={item.value}>
                  {item.name}
                </Tag>
              ))}
            </div>
          }
        >
          <Input
            placeholder="请在此刷卡"
            value={state.storage_user}
            onChange={e => {
              setState({ storage_user: e.target.value });
            }}
          />
        </FormItem>
        <FormItem
          label="机台人员"
          span={8}
          extra={
            <div style={{ margin: '5px 0' }}>
              有效人员：
              {users.map(item => (
                <Tag color="blue" key={item.value}>
                  {item.name}
                </Tag>
              ))}
            </div>
          }
        >
          <Input
            placeholder="请在此刷卡"
            value={state.receive_user}
            onChange={e => {
              setState({ receive_user: e.target.value });
            }}
          />
        </FormItem>
        <FormItem label="设备" span={8}>
          {state.machine_name}
        </FormItem>
        <ProdType span={8} disabled />
        <FormItem label="机长" span={8}>
          {state.captain}
        </FormItem>
        <FormItem label="冠字" span={8}>
          {state.code_head}
        </FormItem>
        <Col span={8}>
          <Button type="primary" onClick={submit}>
            提交
          </Button>
          <Button style={{ marginLeft: 20 }} type="default" onClick={reset}>
            重置
          </Button>
        </Col>
      </Row>
    </div>
  );
};
