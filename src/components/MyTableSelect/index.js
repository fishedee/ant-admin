import React from 'react';
import {Input} from 'antd';
import StandardTable from '@/components/StandardTable';
import style from './index.less';
import classname from 'classname';

const Search = Input.Search;

export default class MyTableSelect extends React.Component{
	state = {
		filterInput:'',
		list:[],
	}
	search = null;
	focus = ()=>{
		this.search.focus();
	}
	clear = ()=>{
		this.state.filterInput = '';
		this.setState({});
		this.resetSelectedRow();
	}
	onFilterChange = (event)=>{
		this.state.filterInput = event.target.value;
		this.setState({});
		this.resetSelectedRow();
	}
	resetSelectedRow = ()=>{
		this.filterRows();
		const list = this.state.list;
		if( list.length != 0 ){
			this.props.onChange(parseInt(list[0]['_tableSelectKey']));
		}
	}
	onSelectedRowChange = (selectedRow)=>{
		this.props.onChange(parseInt(selectedRow));
	}
	onKeyDown = (event)=>{
		const list = this.state.list;
		let selectedRowIndex = list.findIndex((single)=>{
			return single['_tableSelectKey'] == this.props.value;
		});
		if( selectedRowIndex == -1 ){
			return;
		}
		if( event.keyCode == 13 ){
			event.preventDefault();
			this.props.onSelect(parseInt(this.props.value));
		}else if( event.keyCode == 38 &&
			selectedRowIndex > 0 ){
			//up
			selectedRowIndex --;
			this.props.onChange(parseInt(list[selectedRowIndex]['_tableSelectKey']));
		}else if (event.keyCode == 40 &&
			selectedRowIndex < this.state.list.length - 1 ){
			//down
			selectedRowIndex ++;
			this.props.onChange(parseInt(list[selectedRowIndex]['_tableSelectKey']));
		}
	}
	onRowDoubleClick = (selectedRow)=>{
		const list = this.state.list;
		let selectedRowIndex = list.findIndex((single)=>{
			return single['_tableSelectKey'] == this.props.value;
		});
		if( selectedRowIndex == -1 ){
			return;
		}
		this.props.onSelect(parseInt(this.props.value));
	}
	filterRows = ()=>{
		const rows = this.props.rows;
		let list = [];
		for( const i in rows ){
			let single = rows[i];
			let shouldExist = this.props.filterRow(single,this.state.filterInput);
			if( shouldExist ){
				list.push({
					...single,
					'_tableSelectKey':parseInt(i),
				});
			}	
		}
		this.state.list = list;
	}
	searchNode = null;
	onClick = ()=>{
		this.search.focus();
	}
	render = ()=>{
		this.filterRows();
		return (
		<div style={this.props.style} className={classname(style.container,this.props.className)} onClick={this.onClick}>
			<Search
				ref={(node)=>{this.search=node}}
				placeholder="搜索" 
				value={this.state.filterInput} 
				onChange={this.onFilterChange}
				onKeyDown={this.onKeyDown}/>
			<StandardTable
				className={style.root}
				value={this.state.list}
				loading={false}
				rowKey={'_tableSelectKey'}
				columns={this.props.renderRow}
				selectedRow={this.props.value}
				onSelectedRowChange={this.onSelectedRowChange}
				onRowDoubleClick={this.onRowDoubleClick}/>
		</div>
		);
	}

}