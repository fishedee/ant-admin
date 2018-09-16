import React from 'react';
import MyIntervalChart from '@/components/MyIntervalChart';

export default class Line extends React.Component{
    render(){
        const data = [
        {
            name: "伦敦",
            "Jan.": 18.9,
            "Feb.": 28.8,
            "Mar.": 39.3,
            "Apr.": 81.4,
            May: 47,
            "Jun.": 20.3,
            "Jul.": 24,
            "Aug.": 35.6
        },
        {
            name: "柏林",
            "Jan.": 12.4,
            "Feb.": 23.2,
            "Mar.": 34.5,
            "Apr.": 99.7,
            May: 52.6,
            "Jun.": 35.5,
            "Jul.": 37.4,
            "Aug.": 42.4
        }
        ];
        const newData = [];
        for( var i in data ){
            var single = data[i];
            var months = {
                ...single,
            }
            delete months['name'];
            for( var j in months ){
                newData.push({
                    city:single.name,
                    month:j,
                    value:months[j],
                });
            }
        }
        const column = [
            {
                dataIndex:"month",
            },
            {
                dataIndex:"value",
                min:0,
                max:120,
            },
        ];
        const renderLabel = (data)=>{
            return data.value;
        }
        const renderTooltip = (data)=>{
            return {
                name:data.city,
                value:data.value,
            }
        }
        return <MyIntervalChart 
            data={newData} 
            column={column} 
            group={"city"}
            renderLabel={renderLabel}
            renderTooltip={renderTooltip}/> 
    }
}

