import React from 'react';
import colorfly from '@ali/sula-colorfly';

export default class Home extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className="clearfix" style={{ color: colorfly['s-danger'] }}>
        <div className="s-fl-l">左边</div>
        <div className="s-fl-r">右边</div>
      </div>
    );
  }
}
