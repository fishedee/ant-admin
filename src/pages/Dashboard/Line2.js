import React from 'react';
import MyLineChart from '@/components/MyLineChart';

export default class Line extends React.Component{
	render(){
		const data = [
	      {
	        month: "Jan",
	        Tokyo: 7.0
	      },
	      {
	        month: "Feb",
	        Tokyo: 6.9
	      },
	      {
	        month: "Mar",
	        Tokyo: 9.5
	      },
	      {
	        month: "Apr",
	        Tokyo: 14.5
	      },
	      {
	        month: "May",
	        Tokyo: 18.4
	      },
	      {
	        month: "Jun",
	        Tokyo: 21.5
	      },
	      {
	        month: "Jul",
	        Tokyo: 25.2
	      },
	      {
	        month: "Aug",
	        Tokyo: 26.5
	      },
	      {
	        month: "Sep",
	        Tokyo: 23.3
	      },
	      {
	        month: "Oct",
	        Tokyo: 18.3
	      },
	      {
	        month: "Nov",
	        Tokyo: 13.9
	      },
	      {
	        month: "Dec",
	        Tokyo: 9.6
	      }
	    ];
	    const column = [
	    	{
	    		title:"月份",
	    		dataIndex:"month",
	    	},
	    	{
	    		title:"温度",
	    		dataIndex:"Tokyo",
	    	},
	    ];
	    const renderLabel = (data)=>{
	    	return data.Tokyo;
	    }
	    const renderTooltip = (data)=>{
	    	return {
	    		name:'日本',
	    		value:data.Tokyo,
	    	}
	    }
	    return <MyLineChart 
	    	data={data} 
	    	column={column}
	    	renderLabel={renderLabel}
	    	renderTooltip={renderTooltip}/> 
	}
}