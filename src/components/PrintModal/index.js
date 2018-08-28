import React from 'react';
import { Modal ,Button,Tabs} from 'antd';
import style from './index.less';

const TabPane = Tabs.TabPane;

class PrintPreview extends React.Component{
	frameNodeList = [];
	constructor(props){
		super(props);
		for( const i in this.props.documents){
			this.frameNodeList.push(null);
		}
		this.state = {
			activeKey:'0',
		}
	}
	componentDidMount = ()=>{
		for( const i in this.props.documents ){
			var docText = this.props.documents[i];
			var win = this.frameNodeList[i].contentWindow;
			var doc = win.document;
			doc.open();
			doc.write(docText);
			doc.close();
		}
	}
	getNode = (index,node)=>{
		this.frameNodeList[index] = node;
	}
	printCurrent = ()=>{
		var win = this.frameNodeList[this.state.activeKey].contentWindow;
		win.print();
	}
	printAll = ()=>{
		for( const i in this.frameNodeList ){
			var win = this.frameNodeList[i].contentWindow;
			win.print();
		}
	}
	onChange = (activeKey)=>{
		this.state.activeKey = activeKey;
		this.setState({});
	}
	render = ()=>{
		return (
		<Tabs
          activeKey={this.state.activeKey}
          onChange={this.onChange}
          tabPosition={'top'}
          className={style.tab}
        >
        	{this.props.documents.map((doc,index)=>{
        		return (
        			<TabPane tab={"第"+(index+1)+"页"} key={index} forceRender={true}>
		        		<iframe 
							ref={this.getNode.bind(this,index)}
							className={style.frame}
							frameBorder="0"
						/>
		        	</TabPane>
        		);
        	})}
        </Tabs>
		);
		 
		return 
	}
}

export default class PrintModal extends React.Component{
	node = null
	onCancel = ()=>{
		this.props.onClose();
	}
	printCurrent = ()=>{
		this.node.printCurrent();
	}
	printAll = ()=>{
		this.node.printAll();
	}
	render = ()=>{
		var {width,visible,onClose,...resetProps} = this.props;
		width = width || '75%'; 
		return (
			<Modal
				title="打印预览"
				visible={visible}
				onCancel={this.onCancel}
				maskClosable={false}
				destroyOnClose={true}
				footer={null}
				width={width}
				footer = {[
					<Button key="submit1" key="submit" type="primary" onClick={this.printCurrent}>
		              本页打印
		            </Button>,
		            <Button key="submit2" type="primary" onClick={this.printAll}>
		              全部打印
		            </Button>,
					<Button key="back" onClick={this.onCancel}>取消</Button>,
				]}
				wrapClassName={style.printDialog}>
				<PrintPreview 
					ref={(node)=>(this.node=node)}
					{...resetProps}/>
			</Modal>
		);
	}
}