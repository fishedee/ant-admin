import React from 'react';
import { Modal ,Button,Tabs,Radio} from 'antd';
import style from './index.less';
import classname from 'classname';
import html2canvas from 'html2canvas';
const TabPane = Tabs.TabPane;

class PrintPreview extends React.Component{
	frameNodeList = [];
	canvasNodeList = [];
	constructor(props){
		super(props);
		for( const i in this.props.documents){
			this.frameNodeList.push(null);
			this.canvasNodeList.push(null);
		}
		this.state = {
			activeKey:'0',
			showMode:'html',
			hasLoadCanvas:false,
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
	getCanvasNode = (index,node)=>{
		this.canvasNodeList[index] = node;
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
	loadCanvas = (index)=>{
		var win = this.frameNodeList[index].contentWindow;
		var canvas = this.canvasNodeList[index];
		var shareContent = win.document.getElementById('body');
	    var width = shareContent.offsetWidth;
	    var height = shareContent.offsetHeight;
	    var scale = 2;
	    canvas.width = width * scale;
	    canvas.height = height * scale;
	    canvas.getContext("2d").scale(scale, scale);
	    var opts = {
	        scale: scale,
	        canvas: canvas,
	        width: width,
	        height: height,
	        useCORS: true
	    };

		html2canvas(shareContent,opts);
	}
	onChange = (activeKey)=>{
		this.state.activeKey = activeKey;
		this.setState({});
	}
	onShowModeChange = (e)=>{
		this.state.showMode = e.target.value;
		if( this.state.showMode == 'image' &&
			this.state.hasLoadCanvas == false ){
			this.state.hasLoadCanvas = true;
			for( const i in this.props.documents){
				this.loadCanvas(i);
			}
		}
		this.setState({});
	}
	render = ()=>{
		var frameShow = '';
		var canvasShow = '';
		if( this.state.showMode == 'html'){
			canvasShow = style.hidden;
		}else{
			frameShow = style.hidden;
		}
		return (
		<div className={style.container}>
			<Radio.Group onChange={this.onShowModeChange} value={this.state.showMode} buttonStyle="solid">
				<Radio.Button value="html">网页模式</Radio.Button>
				<Radio.Button value="image">图片模式</Radio.Button>
			</Radio.Group>
			<Tabs
	          activeKey={this.state.activeKey}
	          onChange={this.onChange}
	          tabPosition={'top'}
	          className={style.tab}
	        >
	        	{this.props.documents.map((doc,index)=>{
	        		return (
	        			<TabPane tab={"第"+(index+1)+"页"} key={index} forceRender={true}>
				        		
								<div className={style.canvasWrapper}>
									<canvas 
										ref={this.getCanvasNode.bind(this,index)}
										className={classname(style.canvas,canvasShow)}/>
								</div>
								<iframe 
									ref={this.getNode.bind(this,index)}
									className={classname(style.frame,frameShow)}
									frameBorder="0"
								/>
			        	</TabPane>
	        		);
	        	})}
	        </Tabs>
        </div>
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