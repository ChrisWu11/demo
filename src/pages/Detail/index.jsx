import {
  ScrollView,
  View,
  Image,
  Swiper,
  SwiperItem,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Component } from "react";
import "./index.scss";
import { List } from "./list";
import { contentList } from "./content";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      showCarousel: false,
      cachedImage: "",
      carouselImages: [],
      loading: true,
    };
  }

  componentDidMount() {
    // 获取商品ID
    const { id } = Taro.getCurrentInstance().router.params;

    // 从缓存中获取图片路径
    const cachedImage = Taro.getStorageSync(`image_${id}`);
    this.setState({ cachedImage });

    this.getSwiper(id);
    this.getContent(id);
  }

  componentWillUnmount() {
    // 获取商品ID
    const { id } = Taro.getCurrentInstance().router.params;
    // this.removeCachedImage(id);
  }

  getSwiper = async (id) => {
    const list = await List.filter((item) => item.id == id);
    setTimeout(() => {
      this.setState({
        carouselImages: list[0].imgs,
        showCarousel: true,
      });
      // this.removeCachedImage(id);
    }, 2000);
  };

  // 移除缓存的图片
  removeCachedImage = (id) => {
    // 从缓存中移除图片
    Taro.removeStorageSync(`image_${id}`);
  };

  getContent = (id) => {
    const list = contentList.filter((item) => item.id == id);
    setTimeout(() => {
      this.setState({
        detailInfo: list[0],
        loading: false, // 数据加载完成后设置 loading 为 false
      });
    }, 2000); // 模拟延迟操作，2秒后设置 detailInfo 和 loading
  };

  render() {
    const { cachedImage, showCarousel, carouselImages, detailInfo,loading } =
      this.state;

    return (
      <View className="Detail">
        <ScrollView
          className="container-scroll"
          scrollY
          enableBackToTop
          scrollAnchoring
          refresherEnabled
          enhanced
          bounces
          showScrollbar={false}
        >
          {/* 先显示缓存的图片 */}
          {cachedImage && !showCarousel && (
            <Image className="cachedImg" src={cachedImage} />
          )}
          {/* 当轮播图图片加载完成后，替换为轮播图 */}
          {showCarousel && (
            <Swiper>
              {carouselImages.map((image, index) => (
                <SwiperItem key={index}>
                  <Image src={image} />
                </SwiperItem>
              ))}
            </Swiper>
          )}
          {/* 使用骨架屏展示内容 */}
          {loading ? (
            <View className="skeleton" />
          ) : (
            <View className="content">{detailInfo.content}</View> // 显示真实内容
          )}
        </ScrollView>
      </View>
    );
  }
}

export default Index;
