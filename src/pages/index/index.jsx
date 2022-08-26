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
    let list = await List.slice((pageNum-1)*10,pageNum*10);

    Taro.hideLoading();
    const { lists } = itemLists;

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
    for(let i = 0;i < obj.length;i += 2){
      target.lists.left.push(obj[i]);
      i+1 < obj.length && target.lists.right.push(obj[i+1]);
    }
    return target;
  };

  onScrollToLower = () => {
    this.getList();
  };

  getSearchText = (e) => {
    
  };

  searchText = async () => {

  };



  render() {
    const { itemLists, searchText, refresherTriggered } = this.state;
    const { lists } = itemLists;
    return (
      <View className="container">
        <View className="search">
          <Input
            className="search_input"
            placeholder="大家都在搜xxx"
            value={searchText}
            onInput={this.getSearchText}
          ></Input>
          <Text className="search_btn" onClick={this.searchText}>
            搜索
          </Text>
        </View>
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
                  <View className="column_item" key={index}>
                    <ContentItem detail={item} ></ContentItem>
                  </View>
                );
              })}
            </View>
            <View className="wrapper_column">
              {lists?.right?.map((item, index) => {
                return (
                  <View className="column_item" key={index}>
                    <ContentItem detail={item} ></ContentItem>
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
