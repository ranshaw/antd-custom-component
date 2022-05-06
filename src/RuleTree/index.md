---
nav:
  title: 规则树组件
  path: /components
---

## 规则树组件

适合复杂规则配置场景使用

## 使用方式

```js
import RuleTree from 'antd-custom-component';
```

## 代码演示

```tsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select } from 'antd';
export default () => {
  const onChange = () => {};

  const realtion = [
    {
      text: '且',
      value: 'and',
    },
    {
      text: '或',
      value: 'or',
    },
  ];

  const fields = [
    {
      id: 'fruit',
      element: (
        <Select style={{ width: 150 }} placeholder="请选择">
          <Select.Option value="apple">apple</Select.Option>
          <Select.Option value="banana">banana</Select.Option>
        </Select>
      ),
    },
    {
      id: 'operation',
      element: (
        <Select style={{ width: 150 }} placeholder="请选择">
          <Select.Option value=">">Greater Than</Select.Option>
          <Select.Option value="<">Less Than</Select.Option>
          <Select.Option value="=">Equal</Select.Option>
        </Select>
      ),
    },
    {
      id: 'amount',
      rules: [
        {
          required: true,
          message: '数量不能为空',
        },
      ],
      element: <Input style={{ width: 200 }} placeholder="请输入数量" />,
    },
  ];

  return (
    <RuleTree
      canRootChange
      rootRelations={realtion}
      relations={realtion}
      onChange={(changedValues) => {
        console.log('changedValues: ', changedValues);
      }}
      fields={fields}
    />
  );
};
```

### 基本使用

```tsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select } from 'antd';

class RuleTreeDemo extends React.Component {
  render() {
    return (
      <RuleTree
        onChange={(changedValues) => {
          console.log('changedValues: ', changedValues);
        }}
        fields={[
          {
            id: 'fruit',
            element: (
              <Select style={{ width: 150 }} placeholder="请选择">
                <Select.Option value="apple">apple</Select.Option>
                <Select.Option value="banana">banana</Select.Option>
              </Select>
            ),
          },
          {
            id: 'operation',
            element: (
              <Select style={{ width: 150 }} placeholder="请选择">
                <Select.Option value=">">Greater Than</Select.Option>
                <Select.Option value="<">Less Than</Select.Option>
                <Select.Option value="=">Equal</Select.Option>
              </Select>
            ),
          },
          {
            id: 'amount',
            rules: [
              {
                required: true,
                message: '数量不能为空',
              },
            ],
            element: <Input style={{ width: 200 }} placeholder="请输入数量" />,
          },
        ]}
      />
    );
  }
}

export default RuleTreeDemo;
```

### 值关联

通过`casecades`与`onCascade`可以快速完成值关联操作。

```jsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select, Form, Button } from 'antd';

class RuleTreeDemo extends React.Component {
  onCascade(ctx) {
    ctx.setValues('amount', 100);
  }
  render() {
    return (
      <Form onFinish={(values) => console.log(values)}>
        <Form.Item name="ruleTree">
          <RuleTree
            fields={[
              {
                id: 'fruit',
                element: (
                  <Select style={{ width: 150 }} placeholder="请选择">
                    <Select.Option value="apple">apple</Select.Option>
                    <Select.Option value="banana">banana</Select.Option>
                  </Select>
                ),
              },
              {
                id: 'amount',
                rules: [
                  {
                    required: true,
                    message: '数量不能为空',
                  },
                ],
                element: <Input style={{ width: 200 }} placeholder="请输入数量" />,
              },
            ]}
            cascades={['fruit']}
            onCascade={this.onCascade.bind(this)}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </Form>
    );
  }
}

export default RuleTreeDemo;
```

### 渲染关联

通过 field 的`render`可以快速完成值渲染关联。

```tsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select, Form, Button } from 'antd';

class RuleTreeDemo extends React.Component {
  constructor(props) {
    super(props);

    this.fruitValue = {};
  }

  render() {
    return (
      <Form onFinish={(values) => console.log(values)}>
        <Form.Item name="ruleTree">
          <RuleTree
            fields={[
              {
                id: 'fruit',
                element: (
                  <Select style={{ width: 150 }} placeholder="请选择">
                    <Select.Option value="apple">apple</Select.Option>
                    <Select.Option value="banana">banana</Select.Option>
                  </Select>
                ),
              },
              {
                id: 'amount',
                rules: [
                  {
                    required: true,
                    message: '数量不能为空',
                  },
                ],
                render: (ctx) => {
                  const fruitValue = ctx.getValue('fruit');
                  if (this.fruitValue[ctx.key] && fruitValue !== this.fruitValue[ctx.key]) {
                    this.fruitValue[ctx.key] = fruitValue;
                    ctx.setValues('amount', undefined);
                  } else {
                    this.fruitValue[ctx.key] = fruitValue;
                  }
                  if (fruitValue === 'apple') {
                    return (
                      <Select placeholder="请选择" style={{ width: 150 }}>
                        <Select.Option value="egg">鸡蛋</Select.Option>
                        <Select.Option value="milk">牛奶</Select.Option>
                      </Select>
                    );
                  } else if (fruitValue === 'banana') {
                    return <Input placeholder="请输入" style={{ width: 150 }} />;
                  } else {
                    return <div></div>;
                  }
                },
              },
            ]}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </Form>
    );
  }
}
export default RuleTreeDemo;
```

### 更新值

外部修改 value，需要同时更新`key`。

```jsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select, Form, Button } from 'antd';

export default () => {
  const [value, setValue] = React.useState({
    relation: 'or',
    children: [
      {
        relation: 'and',
        children: [
          {
            fruit: 'apple',
            amount: 12,
          },
          {
            fruit: 'banana',
          },
        ],
      },
    ],
  });
  const [key, setKey] = React.useState(0);
  return (
    <div>
      <RuleTree
        key={key}
        value={value}
        fields={[
          {
            id: 'fruit',
            element: (
              <Select style={{ width: 150 }} placeholder="请选择">
                <Select.Option value="a">apple</Select.Option>
              </Select>
            ),
          },
          {
            id: 'amount',
            rules: [
              {
                required: true,
                message: 'amount is required',
              },
            ],
            element: <Input style={{ width: 200 }} />,
          },
        ]}
      />
      <br />
      <Button
        onClick={() => {
          setValue({
            relation: 'and',
            children: [
              {
                relation: 'or',
                children: [
                  {
                    fruit: 'apple',
                    amount: 22,
                  },
                  {
                    fruit: 'apple',
                    amount: 100,
                  },
                ],
              },
            ],
          });
          setKey(key + 1);
        }}
      >
        update value
      </Button>
    </div>
  );
};
```

### 查看模式

```jsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select, Form, Button } from 'antd';

export default () => {
  return (
    <RuleTree
      disabled
      value={{
        relation: 'or',
        children: [
          {
            relation: 'and',
            children: [
              {
                fruit: 'apple',
                amount: 12,
              },
              {
                fruit: 'banana',
              },
            ],
          },
        ],
      }}
      fields={[
        {
          id: 'fruit',
          element: (
            <Select style={{ width: 150 }} placeholder="请选择">
              <Select.Option value="a">apple</Select.Option>
            </Select>
          ),
        },
        {
          id: 'amount',
          rules: [
            {
              required: true,
              message: 'amount is required',
            },
          ],
          element: <Input style={{ width: 200 }} />,
        },
      ]}
    />
  );
};
```

### 某层级不可添加

通过 canAddCondition 和 canAddConditionGroup 来控制某一层级是否可以继续添加

```jsx
import React from 'react';
import { RuleTree } from 'antd-custom-component';
import { Input, Select, Form, Button } from 'antd';

export default () => {
  return (
    <RuleTree
      canAddCondition={(data) => {
        if (data.level === 2) {
          return false;
        }
        return true;
      }}
      value={{
        relation: 'or',
        children: [
          {
            relation: 'and',
            children: [
              {
                fruit: 'apple',
                amount: 12,
              },
              {
                fruit: 'banana',
              },
            ],
          },
        ],
      }}
      fields={[
        {
          id: 'fruit',
          element: (
            <Select style={{ width: 150 }} placeholder="请选择">
              <Select.Option value="a">apple</Select.Option>
            </Select>
          ),
        },
        {
          id: 'amount',
          rules: [
            {
              required: true,
              message: 'amount is required',
            },
          ],
          element: <Input style={{ width: 200 }} />,
        },
      ]}
    />
  );
};
```

### 与 next-form 结合使用

```js
<Playground>
  {() => {
    class Demo extends React.Component {
      constructor() {
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }

      render() {
        const { getFieldDecorator } = this.props.form;
        return (
          <div>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator(
                  'ruleTree',
                  {},
                )(
                  <RuleTree
                    fields={[
                      {
                        id: 'fruit',
                        element: (
                          <Select style={{ width: 150 }} placeholder="请选择">
                            <Select.Option value="apple">apple</Select.Option>
                            <Select.Option value="banana">banana</Select.Option>
                          </Select>
                        ),
                      },
                      {
                        id: 'amount',
                        rules: [
                          {
                            required: true,
                            message: '数量不能为空',
                          },
                        ],
                        element: <Input style={{ width: 200 }} placeholder="请输入数量" />,
                      },
                    ]}
                  />,
                )}
              </Form.Item>
              <button type="primary" htmlType="submit">
                Submit
              </button>
            </Form>
          </div>
        );
      }
    }

    const WrappedDemo = Form.create()(Demo);
    return <WrappedDemo />;
  }}
</Playground>
```

### 与 rc-field-form 结合使用

```js
<Playground>
  {
    class RuleTreeDemo extends React.Component {
      render() {
        return (
          <RcFieldForm onFinish={(values) => console.log(values)}>
            <Field name="ruleTree">
              <RuleTree
                fields={[
                  {
                    id: 'fruit',
                    element: (
                      <Select style={{ width: 150 }} placeholder="请选择">
                        <Select.Option value="apple">apple</Select.Option>
                        <Select.Option value="banana">banana</Select.Option>
                      </Select>
                    ),
                  },
                  {
                    id: 'amount',
                    rules: [
                      {
                        required: true,
                        message: '数量不能为空',
                      },
                    ],
                    element: <Input style={{ width: 200 }} placeholder="请输入数量" />,
                  },
                ]}
              />
            </Field>
            <button>submit</button>
          </RcFieldForm>
        );
      }
    }
  }
</Playground>
```

### 定制 rootRelations 和 relations

```js
<Playground>
  {
    class RuleTreeDemo extends React.Component {
      render() {
        return (
          <RcFieldForm onFinish={(values) => console.log(values)}>
            <Field name="ruleTree">
              <RuleTree
                rootRelations={[
                  { text: '与', value: 'and' },
                  { text: '或', value: 'or' },
                ]}
                relations={[{ text: '或', value: 'or' }]}
                fields={[
                  {
                    id: 'fruit',
                    element: (
                      <Select style={{ width: 150 }} placeholder="请选择">
                        <Select.Option value="apple">apple</Select.Option>
                        <Select.Option value="banana">banana</Select.Option>
                      </Select>
                    ),
                  },
                  {
                    id: 'amount',
                    rules: [
                      {
                        required: true,
                        message: '数量不能为空',
                      },
                    ],
                    element: <Input style={{ width: 200 }} placeholder="请输入数量" />,
                  },
                ]}
              />
            </Field>
            <button>submit</button>
          </RcFieldForm>
        );
      }
    }
  }
</Playground>
```

## API 属性

### RuleTree

该组件用于复杂规则场景。

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| value | 规则编辑器初始值，组件认为 value 不为 undefined 时代表初始值 | `{relation: string; children: [...], [key: string]: any}` | - |
| onChange | 规则编辑器值变化回调， | `(value: {relation: string; children: [...], [key: string]: any}) => void` | - |
| fields | 每一行表达式的配置 | `{id: string; rules: Rule[]; element: ReactElement; render: (ctx) => ReactElement}` | - |
| disabled | 禁用模式/查看模式 | `boolean` | `false` |
| rootRelations | 根节点下拉选择项 | `{text: string, value: string}[]` | `[{text: 'And', value: 'and'}, {text: 'Or', value: 'or'}]` |
| relations | 非根节点下拉选择项 | `{text: string, value: string}[]` | `[{text: 'And', value: 'and'}, {text: 'Or', value: 'or'}]` |
| cascades | 会产生级联的`field id` | `string[]` | - |
| onCascade | 级联回调 | `(ctx: {setValues, getValue}) => void` | - |
| canAddCondition | 是否可以添加条件 | `(data: {level: number, ...}) => boolean` | `true` |
| canAddConditionGroup | 是否可以添加条件组 | `(data: {level: number, ...}) => boolean` | `true` |

### Field

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| id | 一行表单元素中对应的单个表单元素 id | `string` | - |
| render | 表单元素渲染 | `(ctx: {setValues, getValue}) => ReactElement` | - |
| rules | 校验规则, 请参考 [async-validator](https://github.com/yiminghe/async-validator) | `Rule[]` | - |

- setValues 支持 `(string, any) => void` 或 `(Record<string, any>) => void`
- getValue 支持 `(string) => any`
