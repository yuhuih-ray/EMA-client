import React, { Component } from 'react'
import { Tabs, Icon } from 'antd'
import FavMovieList from '../component/favmovieList'
const TabPane = Tabs.TabPane
class MyFavorite extends Component {
  render () {
    return (
      <div>
        <h1>My Favorite</h1>
        <Tabs defaultActiveKey='1'>
          <TabPane tab={<span><Icon type='shop' />Restaurants</span>} key='1'>
            Tab 1
          </TabPane>
          <TabPane
            tab={<span><Icon type='video-camera' />Movies</span>}
            key='2'
          >
            <FavMovieList />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default MyFavorite
