import React from 'react';
import BraftEditor, { EditorState } from 'braft-editor'
import 'braft-editor/dist/index.css'
import style from './index.less';
import customRequest from '../MyUploadImage/customRequest';
import {uploadFile,uploadImage} from '@/utils/constant';
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
		stateContent:fromHTML(''),
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
	onChange = (state)=>{
		this.state.stateContent = state;
		this.setState({});
	}
  save = ()=>{
    this.state.content = toHTML(this.state.stateContent);
    this.props.onChange(this.state.content);
  }
	render = ()=>{
		const {value,onChange} = this.props;
		const media = {
			uploadFn:this.uploadFn,
		}
	    if( value != this.state.content ){
	      this.state.content = value;
	      this.state.stateContent = fromHTML(value);
	    }
		return (
		<BraftEditor
			className={style.root}
			media={media}
			value={this.state.stateContent}
			onChange={this.onChange}
			onSave={this.save}
			onBlur={this.save}
		/>
		);
	} 
}