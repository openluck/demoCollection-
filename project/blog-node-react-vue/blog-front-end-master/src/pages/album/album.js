/**
 * 这是相册的主页
 * 
*/

import React from 'react'
import BusinessCard from '../../components/BusinessCard/BusinessCard'
import { Card, Col, message, Row, Tag } from 'antd'
import { _getAlbumList } from '../../api/album'
import styles from './album.module.less'

const { Meta } = Card

export default class Album extends React.Component {


    state = {
        list: [],
        loading: false,
    }

    componentDidMount () {
        this.getList()
    }

    getList = async () => {
        this.setState({ loading: true })
        let result = await _getAlbumList()
        this.setState({ loading: false, list: result.data })
        console.log(result)
    }

    handleClick(item){
        console.log(item)
        const { _id, isOpen } = item
        if (isOpen) {
            this.props.history.push('/home/album/detail/' + _id)
        } else {
            message.warn('私密相册不能访问')
        }
    }
    render() {
        const { list } = this.state
        return (
            <div className={styles['album']}>
                <div className={styles['album-container']}>
                    <Row gutter={[16, 16]}>
                        {
                            list.map((item) => {
                                return (
                                    <Col span={8} key={item._id}>
                                        <Card
                                            onClick={() => { this.handleClick(item) }}
                                            hoverable
                                            style={{ width: 240, height: 400 }}
                                            cover={<img className={!item.isOpen ? styles['album-container-cardImage'] : ''} alt="example" src={item._poster} />}
                                        >
                                            <Meta
                                            title={<div><b style={{fontSize: 15}}>{ item.name }</b> {
                                                item.isOpen ? <Tag style={{marginLeft: 5}} color="green">公开</Tag> :
                                                <Tag style={{marginLeft: 5}} color="red">私密</Tag>
                                                }
                                                </div>} 
                                            description={item.word} />
                                        </Card>
                                    </Col>
                                )
                            })
                        }


                    </Row>
                    
                </div>
                <div className={styles['album-BusinessCard']}><BusinessCard /></div>
                <div style={{clear: 'both'}}></div>
            </div>
        )
    }
}