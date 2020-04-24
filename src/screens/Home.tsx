import React from "react";
import { Share, ImageBackground, TextStyle } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useSubscription } from "@apollo/react-hooks";

import { View, ViewRow, V1 } from "../components/View";
import { Title14 } from "../components/Text";
import ViewGroupImg from "../components/ViewGroupImg";
import ViewQrCode from "../components/ViewQrCode";
import ViewIconInvite from "../components/ViewIconInvite";
import ViewNotification from "../components/ViewNotification";
import ButtonBoardSetting from "../components/ButtonBoardSetting";
import TouchableBoardList from "../components/TouchableBoardList";
import { TouchableOpacity, TO0 } from "../components/TouchableOpacity";

import ButtonJoinGroup from "../components/ButtonJoinGroup";
import ViewGroupManage from "../components/ViewGroupManage";

import { subscribeBoardsByGroupId } from "../graphql/subscription";
import { useStore } from "../Store";

import bgGroupMain from "../../assets/bgGroupMain.png";
import { ScrollView } from "react-native-gesture-handler";

const titleStyle = {
  fontSize: 28,
  color: "#333333",
} as TextStyle;
export default () => {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const [{ group_id, user_id }, dispatch] = useStore();
  const { data, loading, error } = useSubscription(subscribeBoardsByGroupId, {
    variables: { group_id, user_id },
  });
  if (error) {
    console.warn(error);
  }
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading: true });
  }, [group_id]);
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading });
  }, [loading]);
  if (!data?.mx_groups_by_pk) {
    return (
      <V1>
        <Title14>그룹 로딩</Title14>
      </V1>
    );
  }
  function toggleDrawer() {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }
  const {
    title,
    boards,
    users_aggregate,
    users,
    bg_img_url,
  } = data.mx_groups_by_pk;
  const userCount = users_aggregate.aggregate.count;
  const userStatus: "organizer" | "user" | undefined | "requested" =
    users[0]?.status;
  const hasJoined = userStatus === "user" || userStatus === "organizer";
  const userStatusStr = !users[0]
    ? ""
    : users[0].status === "requested"
    ? "가입 신청 중"
    : users[0].status === "user"
    ? "유저"
    : users[0].status === "organizer"
    ? "오거나이저"
    : "미확인";

  return (
    <>
      <View style={{ height: 197 }} />
      <ImageBackground
        source={bg_img_url ? { uri: bg_img_url } : bgGroupMain}
        style={{ height: 222, position: "absolute", width: "100%" }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: 39,
            paddingHorizontal: 30,
            backgroundColor: "rgba(255,255,255,0.4)",
          }}
        >
          <View>
            <ViewRow>
              <TouchableOpacity onPress={toggleDrawer}>
                <ViewGroupImg color={false} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleDrawer}>
                <ViewNotification />
              </TouchableOpacity>
            </ViewRow>
            <View style={{ height: 52, marginTop: 19, marginRight: 80 }}>
              <Title14 style={[titleStyle]}>{title}</Title14>
            </View>
            <View style={{ marginTop: 8 }}>
              <Title14 style={{ fontSize: 15, color: "#777777" }}>
                {userStatusStr}
              </Title14>
            </View>
          </View>

          <View style={{ position: "absolute", right: 30, top: 39 }}>
            <TO0 onPress={() => navigate("QRcode")}>
              <ViewGroupImg color={true} />
            </TO0>
            <TO0 onPress={() => navigate("QRcode")} style={{ marginTop: 10 }}>
              <ViewQrCode style={{}} />
            </TO0>
            <TO0
              style={{ marginTop: 10 }}
              onPress={(e) => Share.share({ message: "제안을 공유합니다." })}
            >
              <ViewIconInvite />
            </TO0>
          </View>
        </View>
      </ImageBackground>

      <ScrollView
        style={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: "#f0f0f0",
        }}
      >
        <View style={{ paddingHorizontal: 30 }}>
          <ViewRow
            style={{ justifyContent: "space-between", paddingVertical: 20 }}
          >
            <Title14>목록1</Title14>
            {userStatus === "organizer" && <ButtonBoardSetting />}
          </ViewRow>
          {boards.map((b: any, index: number) => (
            <TouchableBoardList key={index} board={b} />
          ))}
        </View>
        {hasJoined && (
          <ViewGroupManage
            title={title}
            userCount={userCount}
            bg_img_url={bg_img_url}
            userStatus={userStatus}
          />
        )}
      </ScrollView>
      {!hasJoined && <ButtonJoinGroup title={title} />}
    </>
  );
};
