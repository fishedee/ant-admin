import React from "react";
import {Row,Col} from 'antd';
import Line from './Line';
import Line2 from './Line2';
import Interval from './Interval';
import Interval2 from './Interval2';
import Pie from './Pie';
import Card from '@/components/Card';
import MyRadioButton from '@/components/MyRadioButton';
import MyDatePicker from '@/components/MyDatePicker';
import StandardQuery from '@/components/StandardQuery';
import style from './index.less';

export default class Sample extends React.Component {
  state = {
    where:{}
  }
  onQueryChange = (where)=>{
    this.state.where = where;
    this.setState({});
  }
  render() {
    var radios = {
        1:"昨天",
        2:"七天",
        3:"本月"
      };
      let queryColumns = [
      {
        title:"",
        dataIndex:"name",
        render:()=>{
          return (<MyRadioButton radios={radios}/>);
        }
      },
      {
        title:"",
        dataIndex:"type",
        render:()=>{
          return (<MyDatePicker />);
        }
      }
    ];
      
      return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="今日销售额"><div className={style.title}>￥ 17000</div></Card>
          </Col>
          <Col span={8}>
            <Card title="本周销售额"><div className={style.title}>￥ 17000</div></Card>
          </Col>
          <Col span={8}>
            <Card title="本月销售额"><div className={style.title}>￥ 17000</div></Card>
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop:'16px'}}>
          <Col span={12}>
            <Card title="销售额走势图">
              <Line/>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="销售额走势图2">
              <Line2/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop:'16px'}}>
          <Col span={12}>
            <Card title="销售成分图">
              <Interval/>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="销售成分图2">
              <Interval2/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop:'16px'}}>
          <Col span={24}>
            <Card title="销售成分图" header={<StandardQuery
                columns={queryColumns} 
                data={this.state.where}
                onChange={this.onQueryChange}/>}>
              <Pie/>
            </Card>
          </Col>
        </Row>
      </div>
      );
  }
}
