import React from 'react';
import {Input} from 'antd';
import StandardTable from '@/components/StandardTable';
import style from './index.less';
import classname from 'classname';

const Search = Input.Search;

export default class MyTableSelect extends React.Component{
	state = {
		selectedRow:null,
		lastCount:-1,
	}
	search = null;
	focus = ()=>{
		this.search.focus();
	}
	onFilterChange = (event)=>{
		let filterInput = event.target.value;
		this.props.onFilterChange(filterInput);
	}
	onSelectedRowChange = (selectedRow)=>{
		this.state.selectedRow = selectedRow;
		this.setState({});
	}
	onKeyDown = (event)=>{
		const list = this.props.value;
		const rowKey = this.props.rowKey;
		let selectedRowIndex = list.findIndex((single)=>{
			return single[this.props.rowKey] == this.state.selectedRow;
		});
		if( selectedRowIndex == -1 ){
			return;
		}
		if( event.keyCode == 13 ){
			event.preventDefault();
			this.props.onSelect(list[selectedRowIndex]);
		}else if( event.keyCode == 38 &&
			selectedRowIndex != 0 ){
			//up
			selectedRowIndex --;
			this.state.selectedRow = list[selectedRowIndex][rowKey];
			this.setState({});
		}else if (event.keyCode == 40 &&
			selectedRowIndex != this.props.value.length - 1 ){
			//down
			selectedRowIndex ++;
			this.state.selectedRow = list[selectedRowIndex][rowKey];
			this.setState({});
		}
	}
	onRowDoubleClick = (selectedRow)=>{
		const list = this.props.value;
		const rowKey = this.props.rowKey;
		let selectedRowIndex = list.findIndex((single)=>{
			return single[this.props.rowKey] == this.state.selectedRow;
		});
		if( selectedRowIndex == -1 ){
			return;
		}
		this.props.onSelect(list[selectedRowIndex]);
	}
	render = ()=>{
		//默认选择第一个
		const list = this.props.value;
		const rowKey = this.props.rowKey;
		if( list && list.length != 0 ){
			if( list.length != this.state.lastCount ){
				this.state.lastCount = list.length;
				this.state.selectedRow = list[0][rowKey];
			}else{
				let selectedRowIndex = list.findIndex((single)=>{
					return single[this.props.rowKey] == this.state.selectedRow;
				});
				if( selectedRowIndex == -1 ){
					this.state.selectedRow = list[0][rowKey];
				}
			}
		}
		return (
		<div style={this.props.style} className={classname(style.container,this.props.className)}>
			<Search
				ref={(node)=>{this.search=node}}
				placeholder="搜索" 
				value={this.props.filterInput} 
				onChange={this.onFilterChange}
				onKeyDown={this.onKeyDown}
				autoFocus={this.props.autoFocus}/>
			<StandardTable
				className={style.root}
				value={this.props.value}
				loading={this.props.loading}
				rowKey={this.props.rowKey}
				columns={this.props.columns}
				selectedRow={this.state.selectedRow}
				onSelectedRowChange={this.onSelectedRowChange}
				onRowDoubleClick={this.onRowDoubleClick}/>
		</div>
		);
	}

}