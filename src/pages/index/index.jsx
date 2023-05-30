import { Input, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Component } from "react";
import ContentItem from "../../components/ContentItem";
import "./index.scss";
import { List } from "./list";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemLists: { lists: { left: [], right: [] }, left: 0, right: 0 },
      searchLists: { lists: { left: [], right: [] }, left: 0, right: 0 },
      pageNum: 1,
      searchText: "",
      refresherTriggered: false,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = async () => {
    const { pageNum, itemLists } = this.state;
    Taro.showLoading();
    let list = await List.slice((pageNum - 1) * 10, pageNum * 10);

    Taro.hideLoading();
    const { lists } = itemLists;

    list.forEach((item) => {
      this.cacheImage(item);
    });

    if (
      list &&
      list.length == 0 &&
      lists.left.length !== 0 &&
      lists.right.length !== 0
    ) {
      Taro.showToast({
        title: "没有更多内容了",
        icon: "none",
      });
      return;
    }
    const tempList = this.handleList(
      pageNum == 1
        ? { lists: { left: [], right: [] }, left: 0, right: 0 }
        : itemLists,
      list
    );
    this.setState({
      itemLists: tempList,
      pageNum: pageNum + 1,
    });
  };

  getNew = async () => {
    this.setState({
      refresherTriggered: true,
    });

    setTimeout(() => {
      this.setState(
        {
          refresherTriggered: false,
          pageNum: 1,
        },
        () => {
          this.getList();
        }
      );
    }, 500);
  };

  handleList = (target, obj) => {
    for (let i = 0; i < obj.length; i += 2) {
      target.lists.left.push(obj[i]);
      i + 1 < obj.length && target.lists.right.push(obj[i + 1]);
    }
    return target;
  };

  onScrollToLower = () => {
    this.getList();
  };


  // 预先缓存图片
  cacheImage = async (item) => {
    Taro.downloadFile({
      url: item.imgs[0],
      success: (res) => {
        // 缓存成功后将图片路径保存到本地存储
        Taro.setStorageSync(`image_${item.id}`, res.tempFilePath);
        console.log('cache success')
      },
      fail: (error) => {
        console.error("Failed to cache image:", error);
      },
    });
  };

  handleClick = (item) => () => {
    // 预先缓存图片
    // this.cacheImage(item);

    Taro.navigateTo({ url: `/pages/Detail/index?id=${item.id}` });
  };

  render() {
    const { itemLists, searchText, refresherTriggered } = this.state;
    const { lists } = itemLists;
    return (
      <View className="container">
        <ScrollView
          className="container-scroll"
          scrollY
          enableBackToTop
          scrollAnchoring
          refresherEnabled
          enhanced
          bounces
          showScrollbar={false}
          refresherTriggered={refresherTriggered}
          onScrollToLower={this.onScrollToLower}
          onRefresherRefresh={this.getNew}
        >
          <View className="wrapper_list">
            <View className="wrapper_column">
              {lists?.left?.map((item, index) => {
                return (
                  <View
                    className="column_item"
                    key={index}
                    onClick={this.handleClick(item)}
                  >
                    <ContentItem detail={item}></ContentItem>
                  </View>
                );
              })}
            </View>
            <View className="wrapper_column">
              {lists?.right?.map((item, index) => {
                return (
                  <View
                    className="column_item"
                    key={index}
                    onClick={this.handleClick(item)}
                  >
                    <ContentItem detail={item}></ContentItem>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Index;
