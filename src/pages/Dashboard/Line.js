import React from 'react';
import MyLineChart from '@/components/MyLineChart';

export default class Line extends React.Component{
	render(){
		const data = [
	      {
	        month: "Jan",
	        Tokyo: 7.0,
	        London: 3.9
	      },
	      {
	        month: "Feb",
	        Tokyo: 6.9,
	        London: 4.2
	      },
	      {
	        month: "Mar",
	        Tokyo: 9.5,
	        London: 5.7
	      },
	      {
	        month: "Apr",
	        Tokyo: 14.5,
	        London: 8.5
	      },
	      {
	        month: "May",
	        Tokyo: 18.4,
	        London: 11.9
	      },
	      {
	        month: "Jun",
	        Tokyo: 21.5,
	        London: 15.2
	      },
	      {
	        month: "Jul",
	        Tokyo: 25.2,
	        London: 17.0
	      },
	      {
	        month: "Aug",
	        Tokyo: 26.5,
	        London: 16.6
	      },
	      {
	        month: "Sep",
	        Tokyo: 23.3,
	        London: 14.2
	      },
	      {
	        month: "Oct",
	        Tokyo: 18.3,
	        London: 10.3
	      },
	      {
	        month: "Nov",
	        Tokyo: 13.9,
	        London: 6.6
	      },
	      {
	        month: "Dec",
	        Tokyo: 9.6,
	        London: 4.8
	      }
	    ];
	    const newData = [];
	    for( var i in data ){
	    	var single = data[i];
	    	newData.push({
	    		month:single.month,
	    		value:single.Tokyo,
	    		city:'日本',
	    	});
	    	newData.push({
	    		month:single.month,
	    		value:single.London,
	    		city:'伦敦',
	    	});
	    }
	    const column = [
	    	{
	    		dataIndex:"month",
	    	},
	    	{
	    		dataIndex:"value",
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
	    return <MyLineChart 
	    	data={newData} 
	    	column={column} 
	    	group={"city"}
	    	renderLabel={renderLabel}
	    	renderTooltip={renderTooltip}/> 
	}
}