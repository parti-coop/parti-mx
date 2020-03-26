import React from "react";
import { Share, Image } from "react-native";

import { ViewRowLeft } from "./View";
import { Text } from "./Text";

import iconHome from "../../assets/iconHome.png";
import iconNavi from "../../assets/iconNavi.png";

export default () => {
  return (
    <ViewRowLeft style={{ paddingHorizontal: 30 }}>
      <Image source={iconHome} />
      <Image source={iconNavi} style={{ paddingHorizontal: 5 }} />
      <Text
        style={{
          fontSize: 13,
          textAlign: "left",
          color: "#888888",
          paddingHorizontal: 2
        }}
      >
        제안 게시판
      </Text>
    </ViewRowLeft>
  );
};