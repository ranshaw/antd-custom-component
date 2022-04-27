---
title: 政务自定义图标
order: 0
---

使用来自 [数字政务图标系统](https://www.iconfont.cn/collections/detail?cid=18867) 的图标，Fusion 内置图标以外的其他图标。

````jsx
import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Message } from '@alifd/next';
import Icon from '@aligov/icon';
import rawIconContent from './iconfont';

function App() {
  const {pending, data} = useAllCustomIcons();

  return (
    <div>
      {pending ? <div style={{ textAlign: 'center' }}><Icon type="loading"/></div> : null}
      <CustomIcons types={data}/>
    </div>
  );
}

function CustomIcons({types}) {
  if (!Array.isArray(types)) return null;

  return (
    <ul className="custom-icon-list">
      {types.map(t => (
        <CopyToClipboard key={t} text={`<Icon custom={true} type="${t}" />`} onCopy={handleCopy}>
          <li>
            <Icon custom={true} type={t} size="xl"/>
            <span>{t}</span>
          </li>
        </CopyToClipboard>
      ))}
    </ul>
  );
}

function handleCopy() {
  Message.success('Copied!')
}

// 简单的操作状态
const ACTION_STATE = {
  // 初始化
  init: 0,
  // 进行中
  pending: 1,
  // 成功
  done: 2,
  // 失败
  failed: 3,
}


function useAllCustomIcons() {
  const [state, setState] = useState(ACTION_STATE.init);
  const [data, setData] = useState([]);

  useEffect(() => {
    setState(ACTION_STATE.pending);
    fetchAllCustomIcons()
      .then(res => {
        setState(ACTION_STATE.done);
        setData(res);
      })
      .catch(() => {
        setState(ACTION_STATE.failed);
      });
  }, []);

  return {
    pending: state === ACTION_STATE.pending,
    done: state === ACTION_STATE.done,
    data,
  };
}

async function fetchAllCustomIcons() {
  const icons = [];
  const ptn = new RegExp('<symbol\\sid="' + Icon.CUSTOM_ICON_PREFIX + '([^"]+)"', 'g');
  let matches;
  while ((matches = ptn.exec(rawIconContent))) {
    icons.push(matches[1]);
  }
  return icons;
}

ReactDOM.render((
  <App/>
), mountNode);
````

````css
.custom-icon-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.custom-icon-list li {
    display: inline-block;
    width: 140px;
    padding: 30px 0;
    color: #666;
    cursor: pointer;
}

.custom-icon-list li:hover {
    color: #333;
    background-color: #f7f7f7;
}

.custom-icon-list i {
    display: block;
    width: 32px;
    margin: 0 auto;
}

.custom-icon-list span {
    display: block;
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
}
````
