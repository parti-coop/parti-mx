import React from "react";
import {
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  Dimensions,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "@apollo/react-hooks";
import { showMessage } from "react-native-flash-message";
import Modal from "react-native-modal";

import { View, ViewRow } from "./View";
import { Image } from "./Image";
import { TORow, TouchableOpacity } from "./TouchableOpacity";
import { Mint15, Title14, Title15 } from "./Text";
import { whiteRoundBg } from "./Styles";

import { updateBoardPermission } from "../graphql/mutation";

import iconSelected from "../../assets/iconSelected.png";
import btnFormSelect from "../../assets/btnFormSelect.png";

const windowHeight = Dimensions.get("window").height;
const boxStyle: StyleProp<ViewStyle> = {
  ...(whiteRoundBg as Object),
  shadowColor: "rgba(0, 0, 0, 0.32)",
  shadowRadius: 5,
  borderTopLeftRadius: 0,
  width: 207,
  position: "absolute",
  zIndex: 1,
};

const options = [
  { value: "all", label: "전체" },
  { value: "member", label: "멤버" },
];
export default function ButtonBoardType(props: {
  boardId: number;
  style?: StyleProp<ViewStyle>;
  permission: string;
}) {
  const { boardId, style } = props;
  const [isVisible, setVisible] = React.useState(false);
  const [permission, setPermission] = React.useState(props.permission);
  const [update, { error }] = useMutation(updateBoardPermission);
  const [position, setPosition] = React.useState<{
    top?: number;
    bottom?: number;
  }>({ top: 0 });
  const boardType = options.find((o) => o.value === permission).label;
  function valueChangeHandler(value: string) {
    setPermission(value);
    setVisible(false);
    if (value !== permission) {
      debouncedCallback();
    }
  }
  const [debouncedCallback] = useDebouncedCallback(async function () {
    const {
      data: {
        update_mx_boards: { affected_rows },
      },
    } = await update({
      variables: { board_id: boardId, permission },
    });
    if (affected_rows === 1) {
      showMessage({ type: "success", message: "수정 성공" });
    }
  }, 300);
  if (error) {
    console.log(error);
  }
  function toggleHandler(event: GestureResponderEvent) {
    const { pageY } = event.nativeEvent;
    if (pageY > windowHeight - 200) {
      setPosition({ bottom: 0 });
    } else {
      setPosition({ top: pageY });
    }
    setVisible(!isVisible);
  }
  return (
    <>
      <TORow style={[{ width: 70 }, style]} onPress={toggleHandler}>
        <Title14 style={{ flex: 1 }}>{boardType}</Title14>
        <Image source={btnFormSelect} />
      </TORow>
      <Modal
        isVisible={isVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={[boxStyle, position]}>
          {options.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => valueChangeHandler(item.value)}
              style={{ paddingHorizontal: 25 }}
            >
              <ViewRow style={{ paddingVertical: 15 }}>
                {item.value === permission ? (
                  <Mint15 style={{ flex: 1 }}>{item.label}</Mint15>
                ) : (
                  <Title15 style={{ flex: 1 }}>{item.label}</Title15>
                )}
                {item.value === permission && (
                  <Image source={iconSelected} style={{ marginLeft: 10 }} />
                )}
              </ViewRow>
              {i !== options.length - 1 && (
                <View style={{ height: 1, backgroundColor: "#e4e4e4" }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}
