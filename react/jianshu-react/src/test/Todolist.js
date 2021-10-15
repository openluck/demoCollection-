import React, { Component } from 'react';
import TodoItem from './TodoItem'

class Todolist extends Component{
	constructor(props) {
		super(props);
		this.state = {
			inputValue: '',
			list: []
		}
	}

	render() {
		return (
				<div>
					<div>
						<input type="text" value={ this.state.inputValue } onChange={ this.handleInputChange.bind(this) }/>
						<button onClick={ this.handleBtnClick.bind(this)}>提交</button>
					</div>
					<div>
						<ul>
							{
								this.state.list.map((item,index) => {
									// return (
									// 		{/*<li key={index} onClick={this.handelDeleItem.bind(this,index)}>{item}</li>*/}
									//
									// )
									 return <div><TodoItem content={ item } ></TodoItem> </div>
								})
							}
						</ul>
					</div>
				</div>
		)
	}

//监听input的输入框
	handleInputChange(e) {
		// 打印的是todolist这个组件
		// console.log(this)
		this.setState({
			inputValue: e.target.value
		})
	}

//	点击提交按钮
	handleBtnClick() {
			this.setState({
				list: [...this.state.list, this.state.inputValue],
				inputValue: ''
			})
	}

// 删除item li
	handelDeleItem(index) {
		// console.log(index)
		const list = [...this.state.list]
		list.splice(index, 1)
		this.setState({
			list : list
		})
	}
}

export default Todolist
