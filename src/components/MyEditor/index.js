import React from 'react';
import BraftEditor, { EditorState } from 'braft-editor'
import 'braft-editor/dist/index.css'
import style from './index.less';
import customRequest from '../MyUploadImage/customRequest';
import {uploadFile,uploadImage} from '@/utils/constant';
import ImageCompressor from 'image-compressor.js';

export function fromHtml(html){
	return EditorState.createFrom(html);
}

export function toHtml(state){
	return state.toHTML();
}

class SourceCodeEditor extends React.Component{
	state = {
		content:'',
	}
	componentDidMount = ()=>{
		this.state.content = toHtml(this.props.defaultSource);
		this.props.onSourceChange(this.state.content);
		this.setState({});
	}
	onChange = (e)=>{
		this.state.content = e.target.value;
		this.setState({});
		this.props.onSourceChange(this.state.content);
	}
	render(){
		let height = this.props.height - 110;
		return (<div className={style.areaContainer} style={{height:height+'px'}}>
			<textarea className={style.area} value={this.state.content} onChange={this.onChange}/>
		</div>);
	}
}
export default class MyEditor extends React.Component{
	state = {
		source:'',
	}
	uploadFile = (param,config)=>{
		customRequest({
			data:{},
			headers:{},
			action:config.action,
			filename:config.name,
			file:param.file,
			withCredentials:true,
			onProgress:function(e){
				param.progress(e);
			},
			onError:function(e){
				param.error(e);
			},
			onSuccess:function(data,xhr){
				try{
					var url = config.onResponse(data);
					param.success({
						url:url,
            			meta:{},
					});
				}catch(e){
					param.error(e);
				}
			},
		});
	}
	uploadImage = (param)=>{
		new ImageCompressor(param.file,{
			quality: .8,
			maxWidth:this.props.maxWidth || 1920,
			maxHeight:this.props.maxHeight ||1920,
			success:(result)=>{
				param.file = result;
				this.uploadFile(param,uploadImage);
			},
			error:(e)=>{
				param.error(e);
			},
	    });
	}
	uploadFn = (param)=>{
		var type = param.file.type;
		if( type.substr(0,6) =="image/"){
			this.uploadImage(param);
		}else{
			this.uploadFile(param,uploadFile);
		}
	}
	onSourceChange = (source)=>{
		this.state.source = source;
	}
	onSourceConfirm = ()=>{
		this.props.onChange(fromHtml(this.state.source));
	}
	render = ()=>{
		const {value,onChange} = this.props;
		const media = {
			uploadFn:this.uploadFn,
		}
		const modalWidth = document.body.clientWidth*0.6;
		const modalHeight = document.body.clientHeight*0.6;
		const extendControls = [
			'separator',
		    {
		        key: 'source-code',
		        type: 'modal',
		        title: '查看源码', // 指定鼠标悬停提示文案
		        className: 'source-code', // 指定触发按钮的样式名
		        html: null, // 指定在按钮中渲染的html字符串
		        text: 'HTML', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示    
		        onClick: () => {}, // 指定触发按钮点击后的回调函数
		        modal: {
		            id: 'source-code-modal', // 必选属性，传入一个唯一字符串即可
		            title: '查看源码', // 指定弹窗组件的顶部标题
		            className: 'source-code-modal', // 指定弹窗组件样式名
		            width: modalWidth, // 指定弹窗组件的宽度
		            height: modalHeight, // 指定弹窗组件的高度
		            showFooter: true, // 指定是否显示弹窗组件底栏
		            showCancel: true, // 指定是否显示取消按钮
		            showConfirm: true, // 指定是否显示确认按钮
		            confirmable: true, // 指定确认按钮是否可用
		            showClose: true, // 指定是否显示右上角关闭按钮
		            cancelText: '取消', // 指定取消按钮文字
		            confirmText: '确定', // 指定确认按钮文字
		            bottomText: null, // 指定弹窗组件底栏左侧的文字，可传入jsx
		            onConfirm: this.onSourceConfirm, // 指定点击确认按钮后的回调函数
		            onCancel: () => {}, // 指定点击取消按钮后的回调函数
		            onClose: () => {}, // 指定弹窗被关闭后的回调函数
		            children: <SourceCodeEditor 
		            	width={modalWidth} 
		            	height={modalHeight}
		            	defaultSource={value}
		            	onSourceChange={this.onSourceChange}/>, // 指定弹窗组件的内容组件
		        }
		    }
		];
		return (
		<BraftEditor
			className={style.root}
			extendControls={extendControls}
			media={media}
			value={value}
			onChange={onChange}
		/>
		);
	} 
}