import React from "react";
import {Row,Col} from 'antd';
import Line from './Line';
import Line2 from './Line2';
import Interval from './Interval';
import Interval2 from './Interval2';
import Pie from './Pie';

export default class Sample extends React.Component {
  render() {
      return (
        <Row>
        	<Row><Pie/></Row>
        	<Row><Interval/></Row>
        	<Row><Interval2/></Row>
    			<Row><Line/></Row>
    			<Row><Line2/></Row>
       </Row>
      );
  }
}
