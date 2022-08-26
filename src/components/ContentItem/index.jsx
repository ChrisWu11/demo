import { Image, Text, View } from "@tarojs/components";
import "./index.scss";


const ContentItem = (props) => {
  const {
    detail = {},
  } = props;
  const {
    id,
    imgs,
    content,
    avatarUrl,
    nickName,
    star,
  } = detail;
  const images = imgs.filter((item) => item !== "");

  return (
    <View className="list_item">
      {images.length > 0 && (
          <View className="img_box">
              <Image
                  mode="widthFix"
                  className="img"
                  src={images[0]}
                ></Image>
          </View>
      )}
      <View className="info">
        <View className="info1">
          <View className="content">{content}</View>
        </View>
        <View className="info2">
       
            <View className="user_info">
              <View className="user_icon">
                <Image className="icon" src={avatarUrl}></Image>
              </View>
              <Text className="user_name">{nickName}</Text>
              <View className="star">
                  <View>❤{star}</View>
              </View>
            </View>          
        </View>
      </View>
    </View>
  );
};

export default ContentItem;
