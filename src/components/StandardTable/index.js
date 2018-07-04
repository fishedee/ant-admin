import React, { Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

export default class StandardTable extends React.Component {
  handleSelectedRowChange = (selectedRowKeys)=>{
    this.props.onSelectedRowsChange(selectedRowKeys);
  }

  cleanSelectedKeys = () => {
    this.props.onSelectedRowsChange([]);
  };

  handleTableChange = (pagination) => {
    this.props.onPaginactionChange({
      pageIndex:(pagination.current-1)*pagination.pageSize,
      pageSize:pagination.pageSize,
      count:pagination.total,
    });
  };

  onCellChange = (key,dataIndex,event)=>{
    let list = this.props.data;
    let newList = list.map((item)=>{
      if( item[this.props.rowKey] != key ){
        return item;
      }
      return {
        ...item,
        [dataIndex]:event.target.value,
      };
    })
    this.props.onChange(key,dataIndex,event.target.value,newList);
  }

  render() {
    const { data, paginaction , loading, columns, rowKey ,selectedRows } = this.props;

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
    if( selectedRows ){
      rowSelection = {
        selectedRowKeys:selectedRows,
        onChange: this.handleSelectedRowChange,
      };
    }

    let newColumns = [];
    for( let i in columns ){
      let newColumn = columns[i];
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
        {rowSelection?<div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 12 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>:null}
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
