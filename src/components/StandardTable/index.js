import React, { Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

export default class StandardTable extends React.Component {
  state = {
    selectedRows:[],
  }

  handleSelectedRowChange = (rows)=>{
    this.setState({selectedRows:rows});
  }

  onRowClick = (data)=>{
    if( this.props.onSelect ){
      this.setState({selectedRows:[data[this.props.rowKey]]});
    }
  }

  onRowDoubleClick = (data)=>{
    if( this.props.onSelect ){
      this.props.onSelect(data);
    }
  }

  handleTableChange = (pagination) => {
    this.props.onPaginactionChange({
      pageIndex:(pagination.current-1)*pagination.pageSize,
      pageSize:pagination.pageSize,
      count:pagination.total,
    });
  };

  onCellChange = (key,dataIndex,event)=>{
    let value = null;
    if( event && event.target ){
      value = event.target.value;
    }else{
      value = event;
    }
    let list = this.props.value;
    let newList = list.map((item)=>{
      if( item[this.props.rowKey] != key ){
        return item;
      }
      return {
        ...item,
        [dataIndex]:value,
      };
    })
    this.props.onChange(newList,key,dataIndex,value);
  }

  render() {
    const { value, paginaction , loading, columns, rowKey ,style ,onSelect} = this.props;

    let paginationProps = false;
    if( paginaction ){
      paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal:(total)=>{
          return '共'+total+'条'
        },
        current:paginaction.pageIndex/paginaction.pageSize+1,
        pageSize:paginaction.pageSize,
        total:paginaction.count,
      };
    }
    
    let rowSelection = null;
    if( onSelect ){
      rowSelection = {
        selectedRowKeys:this.state.selectedRows,
        onChange: this.handleSelectedRowChange,
        type:'radio',
      };
    }

    let newColumns = [];
    for( let i in columns ){
      let newColumn = {...columns[i]};
      ((newColumn)=>{
        if( newColumn.render ){
          newColumn.oldRender = newColumn.render;
          newColumn.render = (text,record)=>{
            let element = newColumn.oldRender(text,record);
            if( React.isValidElement(element)){
              let newElement =  React.cloneElement(element,{
                value:text,
                onChange:this.onCellChange.bind(this,record[rowKey],newColumn.dataIndex)
              });
              return newElement;
            }else{
              return element;
            }
          }
        }
      })(newColumn);
      newColumns.push(newColumn);
    }

    return (
      <div className={styles.standardTable}>
        <Table
          style={style}
          bordered={true}
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={value}
          columns={newColumns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          onRow={(record)=>{
            return {
              onClick:this.onRowClick.bind(this,record),
              onDoubleClick:this.onRowDoubleClick.bind(this,record),
            };
          }}
        />
      </div>
    );
  }
}
