---
title: 使用 Fusion 内置图标
order: 2
---

````jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@aligov/icon';

class App extends Component {
  render() {
    return (
      <div>
        <Icon type="smile" size="xl" />
      </div>
    );
  }
}

ReactDOM.render((
  <App />
), mountNode);
````
