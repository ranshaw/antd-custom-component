import { defineConfig } from 'dumi';
const path = require('path')

export default defineConfig({
  title: 'antd自定义组件',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  // more config: https://d.umijs.org/config
  alias: {
    // "@alifd":  path.resolve(__dirname, 'src/RuleTree/packages/@alifd'),
    // "@aligov":  path.resolve(__dirname, 'src/RuleTree/packages/@aligov'),
    // "@sula":  path.resolve(__dirname, 'src/RuleTree/packages/@sula'),
    // "d3-hierarchy": path.resolve(__dirname, 'src/RuleTree/packages/d3-hierarchy'),
    // "dayjs":  path.resolve(__dirname, 'src/RuleTree/packages/dayjs'),
    // "bignumber.js": path.resolve(__dirname, 'src/RuleTree/packages/bignumber.min.js'),
    // "lodash.clonedeep": path.resolve(__dirname, 'src/RuleTree/packages/lodash.clonedeep'),
    // "moment": path.resolve(__dirname, 'src/RuleTree/packages/moment'),
    // "rc-field-form":  path.resolve(__dirname, 'src/RuleTree/packages/rc-field-form'),
    // "async-validator": path.resolve(__dirname, 'src/RuleTree/packages/async-validator'),
    // "react-dnd": path.resolve(__dirname, 'src/RuleTree/packages/react-dnd'),
    // "react-dnd-html5-backend": path.resolve(__dirname, 'src/RuleTree/packages/react-dnd-html5-backend'),
    // "dnd-core": path.resolve(__dirname, 'src/RuleTree/packages/dnd-core'),
    // "react-lifecycles-compat": path.resolve(__dirname, 'src/RuleTree/packages/react-lifecycles-compat'),
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      }
    ]
  ]
});
