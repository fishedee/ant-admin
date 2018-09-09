import React from 'react';
import { Upload, Icon, message,Button ,notification ,Card } from 'antd';
import style from './index.less';
import {uploadImage} from '@/utils/constant';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default class Avatar extends React.Component {
  state = {
    progress: 0,
    state:'normal',
  };

  onChange = async (info) => {
    if (info.file.status === 'uploading') {
      this.state.state = 'progress';
      this.state.progress = Math.round(info.file.percent);
      this.setState({});
    }else if( info.file.status == 'done' ){
      this.state.state = 'normal';
      this.setState({});
      var response = info.file.response;
      try{
        var data = uploadImage.onResponse(response);
        this.props.onChange(response.data);
      }catch(e){
        notification.error({
          message:'上传失败',
          description:e.message
        });
      }
    }else if( info.file.status == 'error' ){
      this.state.state = 'normal';
      this.setState({});
      notification.error({
        message:'上传失败',
        description:'请检查你的网络情况',
      });
    }else{
      throw new Error("未知的上传错误!"+info.file.status);
    }
  }
  onRemove = ()=>{
    return false
  }
  onPreview = ()=>{

  }
  render() {
    const value = this.props.value;
    const placeholder = this.props.placeholder || '请点击上传';
    var info = null;
    if( this.state.state == 'normal' ){
      info = <Button><Icon type="upload" />{placeholder}</Button>
    }else{
      info = <Button>{'上传中：'+this.state.progress+'%'}</Button>
    }
    var preview = null;
    if( value && value != ""){
      preview = <div><img className={style.root} src={value}/></div>;
    }else{
      preview = null;
    }
    return (
      <div>
        {preview}
        <Upload
          name={uploadImage.name}
          accept="image/*"
          listType="picture"
          showUploadList={false}
          action={uploadImage.action}
          onChange={this.onChange}
          onRemove={this.onRemove}
        >
         {info}
        </Upload>
      </div>
    );
  }
}