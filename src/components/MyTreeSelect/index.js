import React from 'react';
import { Tree , Input } from 'antd';
import style from './index.less';
import classname from 'classname';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;

export default class MyTreeSelect extends React.Component{
	state = {
		filterInput:'',
		expandedKeys:['_all']
	}
	onExpand = (expandedKeys)=>{
		if( expandedKeys.indexOf('_all') == -1 ){
			expandedKeys.push('_all');
		}
		this.state.expandedKeys = expandedKeys;
		this.setState({});
	}
	onFilterChange = (event)=>{
		this.state.filterInput = event.target.value;
		this.setState({});
	}
	onSelect = (keys)=>{
		let data = keys[0];
		if( data == '_all'){
			data = undefined;
		}else{
			data = parseInt(data);
		}
		this.props.onChange(data);
	}
	renderNode = (root)=>{
		let renderNode = this.props.renderNode || function(data){
			return data.name;
		}
		let childNodes = [];
		for( let i in root.children ){
			let singleChild = root.children[i];
			childNodes.push(this.renderNode(singleChild));
		}
		if( root.id == 0 ){
			return (
				<TreeNode title="全部" key={'_all'}>
					{childNodes}
				</TreeNode>
			);
		}else{
			if( childNodes.length == 0 ){
				return (<TreeNode title={renderNode(root.data)} key={root.id} isLeaf={true}/>);
			}else{
				return (
					<TreeNode title={renderNode(root.data)} key={root.id}>
						{childNodes}
					</TreeNode>
				);
			}
		}
	}
	filterNode = (root,filter)=>{
		let renderNode = this.props.renderNode || function(data){
			return data.name;
		}
		name = renderNode(root.data);
		if( name.indexOf(filter) != -1 ){
			return root;
		}
		let newChildren = [];
		for( let i in root.children ){
			let singleChild = this.filterNode(root.children[i],filter);
			if( singleChild != null ){
				newChildren.push(singleChild);
			}
		}
		if( newChildren.length == 0 
			&& root.id != 0 ){
			return null;
		}else{
			return {
				id:root.id,
				children:newChildren,
				data:root.data,
			}
		}
	}
	buildNode = (children,current)=>{
		let childNode = children[current] || [];
		for( let i in childNode ){
			childNode[i].children = this.buildNode(children,childNode[i].id);
		}
		return childNode;
	}
	renderTreeNode = ()=>{
		const nodes = this.props.nodes;
		let children = {};
		for( let id in nodes ){
			let single = nodes[id];
			let parent = 0;
			if( !single.parent ){
				parent = 0;
			}else{
				parent = single.parent;
			}
			if( !children[parent] ){
				children[parent] = [];
			}
			children[parent].push({
				id:id,
				data:single
			});
		}
		let root = {
			id:0,
			children:this.buildNode(children,0),
			data:{}
		};
		const filterInput = this.state.filterInput.trim();
		if( filterInput != ''){
			root = this.filterNode(root,filterInput);
		}
		return this.renderNode(root);
	}
	render = ()=>{
		let value = this.props.value;
		if( !value ){
			value = '_all';
		}else{
			value = value+'';
		}
		return (
		<div style={this.props.style} className={classname(style.container,this.props.className)}>
			<Input 
				placehoder="请输入" 
				size="small" 
				value={this.state.filterInput} 
				onChange={this.onFilterChange}/>
			<DirectoryTree
				className={style.root}
				expandedKeys={this.state.expandedKeys}
				onExpand={this.onExpand}
				selectedKeys={[value]}
				onSelect={this.onSelect}>
				{this.renderTreeNode()}
			</DirectoryTree>
		</div>
		);
	}
}