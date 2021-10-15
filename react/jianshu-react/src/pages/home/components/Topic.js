/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-15 13:40:51
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-15 14:28:28
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { TopicWrapper, TopicItem } from '../style';

class Topic extends PureComponent {
	render() {
		const { list } = this.props;
		console.log('topic中的 this.props',this.props);
		return (
			<TopicWrapper>
				{
					list.map((item) => (
						<TopicItem key={item.get('id')}>
							<img
								className='topic-pic'
								src={item.get('imgUrl')}
								alt=''
							/>
							{item.get('title')}
						</TopicItem>
					))
				}
			</TopicWrapper>
		)
	}
}

const mapState = (state) => ({
	list: state.getIn(['home', 'topicList'])
});

export default connect(mapState, null)(Topic);