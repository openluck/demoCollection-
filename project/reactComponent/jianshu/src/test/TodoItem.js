import React, { Component } from 'react'

class TodoItem extends Component {
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	render() {
		// 子组件没有返回
		// return ()
		const { content } = this.props;
		return (
				<div>
					{content}
				</div>
		)
	}

//
	handleClick(){
		const { deleteItem, index } = this.props;
		deleteItem(index)
	}
}

export default TodoItem;
