import React, { Component } from 'react'
import { List, Avatar, Button, Modal, Tooltip } from 'antd'
import config from '../config.js'
import storage from '../utils/Storage'
import Invite from '../component/invite'
import { T } from 'antd/lib/upload/utils'

const axios = require('axios')

class FriendList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      friends: []
    }
  }

  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = e => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  handleCancel = e => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  componentDidMount () {
    axios({
      method: 'get',
      url: config.base_url + 'api/v1/user/friends/index',
      headers: {
        Authorization: 'Bearer ' + storage.getAuthToken()
      }
    }).then(response => {
      console.log(response)
      this.setState({
        friends: response.data.data,
        loading: false
      })
    })
  }
  invite = item => {
    console.log(item.email)
  }

  render () {
    return (
      <div>
        <Tooltip title='invite friend'>
          <Button icon='team' onClick={this.showModal} />
        </Tooltip>
        <Modal
          style={{ width: '30%' }}
          title='Friends'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <List
              itemLayout='horizontal'
              dataSource={this.state.friends}
              renderItem={item => (
                <div>
                  <List.Item actions={[<Invite user={item} />]}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatarUrl} />}
                      title={<a href='https://ant.design'>{item.username}</a>}
                    />
                  </List.Item>

                </div>
              )}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default FriendList
