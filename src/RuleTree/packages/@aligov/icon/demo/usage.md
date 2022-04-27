---
title: 使用政务图标
order: 1
---

使用来自 [数字政务图标系统](https://www.iconfont.cn/collections/detail?cid=18867) 的图标

````jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@aligov/icon';

const sizes = ['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl'];

class App extends Component {
  render() {
    return (
      <div>
        <div>普通使用：<Icon custom={true} type="kefu-xianxing" /></div>
        <div>
            尺寸：
            {sizes.map(s => <Icon custom={true} type="kefu-xianxing" size={s} />)}
        </div>

        <div>
            颜色：
            <p style={{ color: 'red' }}>部分图标不支持修改颜色，是因为设计师提供的 svg 里，写死了颜色（SVG 里配里 fill 属性），需要联系设计师进行更新</p>
            <div>使用 color 属性：<Icon custom={true} type="kefu-xianxing" size="xl" color="#255BDA" /></div>
            <div>使用 style 属性：<Icon custom={true} type="kefu-xianxing" size="xl" style={{ color: 'red' }} /></div>
            <div>使用 css，如 hover 改变：<Icon custom={true} type="kefu-xianxing" size="xl" className="custom-icon" /></div>
        </div>
      </div>
    );
  }
}

ReactDOM.render((
  <App />
), mountNode);
````

````css
.custom-icon {
    color: cadetblue;
}

.custom-icon:hover {
    color: coral !important;
}
````
