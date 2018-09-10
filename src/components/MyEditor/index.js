import React from 'react';
import BraftEditor, { EditorState } from 'braft-editor'
import 'braft-editor/dist/index.css'
import style from './index.less';
import customRequest from '../MyUploadImage/customRequest';
import {uploadFile} from '@/utils/constant';
import ImageCompressor from 'image-compressor.js';

function fromHTML(html){
	return EditorState.createFrom(html);
}

function toHTML(state){
	return state.toHTML();
}

export default class MyEditor extends React.Component{
	state = {
		content:null,
		stateContent:null,
	}
	uploadFile = (param)=>{
		customRequest({
			data:{},
			headers:{},
			action:uploadFile.action,
			filename:uploadFile.name,
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
					var url = uploadFile.onResponse(data);
					param.success({
						url:url,
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
	       	this.uploadFile(param);
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
			this.uploadFile(param);
		}
	}
	onChange = (state)=>{
		console.log(state);
		this.state.stateContent = state;
		//this.state.content = toHTML(state);
		this.setState({});
		//this.props.onChange(this.state.content);
	}
	render = ()=>{
		const {value,onChange} = this.props;
		const media = {
			uploadFn:this.uploadFn,
		}
		return (
		<BraftEditor
			className={style.root}
			media={media}
			value={this.state.stateContent}
			onChange={this.onChange}
		/>
		);
	} 
}