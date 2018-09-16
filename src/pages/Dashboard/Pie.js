import React from 'react';
import MyPieChart from '@/components/MyPieChart';

export default class Line extends React.Component{
    render(){
        const data = [
            {
                item: "事例一",
                count: 40
            },
            {
                item: "事例二",
                count: 21
            },
            {
                item: "事例三",
                count: 17
            },
            {
                item: "事例四",
                count: 13
            },
            {
                item: "事例五",
                count: 9
            }
        ];
        const column = [
            {
                dataIndex:"item",
            },
            {
                dataIndex:"count",
            },
        ];
        const renderLabel = (data)=>{
            return data.item+":"+data._precent*100+'%';
        }
        const renderTooltip = (data)=>{
            return {
                name:data.item,
                value:data.count+'个',
            }
        }
        return <MyPieChart 
            data={data} 
            column={column}
            renderLabel={renderLabel}
            renderTooltip={renderTooltip}/> 
    }
}

