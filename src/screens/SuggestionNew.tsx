import React from "react";
import {
  StyleProp,
  TextStyle,
  Alert,
  Vibration,
  Keyboard,
  ViewStyle,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { useMutation } from "@apollo/react-hooks";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibraryAsync } from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/src/ImagePicker.types";
import * as DocumentPicker from "expo-document-picker";

import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { Body16, Title22, Mint16, Mint13 } from "../components/Text";
import { Image } from "../components/Image";
import { TextInput } from "../components/TextInput";
import HeaderConfirm from "../components/HeaderConfirm";
import { View, ViewRow, V0 } from "../components/View";
import { TO1, TO0 } from "../components/TouchableOpacity";
import TouchableClosingMethod from "../components/TouchableClosingMethod";
import { LineSeperator, SmallVerticalDivider } from "../components/LineDivider";
import HeaderSuggestion from "../components/HeaderSuggestion";

import { uploadFileUUID } from "../firebase";
import { useStore } from "../Store";
import { insertSuggestion } from "../graphql/mutation";

import iconFormClosed from "../../assets/iconFormClosed.png";
const options = [
  { label: "30일 후 종료", value: 0 },
  // { label: "멤버 과반수 동의시 종료", value: 1 },
  // { label: "제안 정리시 종료", value: 2 }
];

const textStyle: StyleProp<TextStyle> = {
  fontSize: 16,
  textAlign: "left",
  color: "#555555",
  paddingHorizontal: 0,
  flex: 1,
};
const bgStyle: StyleProp<ViewStyle> = {
  alignItems: "stretch",
  borderRadius: 25,
  backgroundColor: "#ffffff",
  shadowColor: "rgba(0, 0, 0, 0.15)",
  elevation: 1,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowRadius: 1,
  shadowOpacity: 1,
};
function promiseArray(o: ImageInfo | DocumentPicker.DocumentResult) {
  return new Promise(async function (res) {
    const uri = await uploadFileUUID(o.uri, "posts").then((snap) =>
      snap.ref.getDownloadURL()
    );
    res({ ...o, uri });
  });
}

export default () => {
  const [insert, { loading }] = useMutation(insertSuggestion);
  const [{ board_id, user_id, group_id }, dispatch] = useStore();
  const [sTitle, setSTitle] = React.useState("");
  const [sContext, setSContext] = React.useState("");
  const [sBody, setSBody] = React.useState("");
  const [closingMethod, setClosingMethod] = React.useState(0);
  const [imageArr, setImageArr] = React.useState<Array<ImageInfo | undefined>>(
    []
  );
  const [fileArr, setFileArr] = React.useState<
    Array<DocumentPicker.DocumentResult>
  >([]);
  const contextRef = React.useRef(null);
  const scrollRef = React.useRef(null);

  const { navigate } = useNavigation();
  function resetInput() {
    setSTitle("");
    setSContext("");
    setSBody("");
    setImageArr([]);
    setFileArr([]);
  }
  async function addImage() {
    Keyboard.dismiss();
    return launchImageLibraryAsync({
      quality: 1,
    }).then(({ cancelled, ...res }) => {
      if (cancelled !== true) {
        setImageArr([...imageArr, res as ImageInfo]);
      }
    });
  }
  async function fileUploadHandler() {
    const file = await DocumentPicker.getDocumentAsync();
    setFileArr([...fileArr, file]);
  }
  async function fileDeleteHandler(fileIndex: number) {
    return Alert.alert("파일 삭제", "해당 파일을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제!",
        onPress: function () {
          fileArr.splice(fileIndex, 1);
          setFileArr([...fileArr]);
        },
      },
    ]);
  }
  async function imageLongpressHandler(imageIndex: number) {
    Keyboard.dismiss();
    Vibration.vibrate(100);
    return Alert.alert("이미지 삭제", "해당 이미지를 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제!",
        onPress: function () {
          imageArr.splice(imageIndex, 1);
          setImageArr([...imageArr]);
        },
      },
    ]);
  }
  async function insertPressHandler() {
    if (!sTitle.trim()) {
      return showMessage({
        message: "제안명을 입력해주세요.",
        type: "warning",
      });
    }
    if (sTitle?.trim()?.length > 20) {
      return showMessage({
        message: "제안명을 20자 이내로 입력해주세요.",
        type: "warning",
      });
    }
    if (!sBody?.trim()) {
      return showMessage({
        message: "제안 내용을 입력해주세요.",
        type: "warning",
      });
    }
    if (!sContext?.trim()) {
      return showMessage({
        message: "제안 배경을 입력해주세요.",
        type: "warning",
      });
    }
    let images = null;
    dispatch({ type: "SET_LOADING", loading: true });
    if (imageArr.length > 0) {
      const urlArr = await Promise.all(imageArr.map(promiseArray));
      images = urlArr;
    }
    let files = null;
    if (fileArr.length > 0) {
      const urlArr = await Promise.all(fileArr.map(promiseArray));
      files = urlArr;
    }
    await insert({
      variables: {
        sTitle,
        sContext,
        sBody,
        board_id,
        group_id,
        metadata: { closing_method: closingMethod },
        images,
        files,
      },
    });

    navigate("SuggestionList");
  }
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading });
    return resetInput;
  }, [loading]);

  return (
    <>
      <HeaderConfirm onPress={insertPressHandler} />
      <KeyboardAwareScrollView ref={scrollRef}>
        <HeaderSuggestion />
        <View
          style={{ paddingHorizontal: 28, paddingBottom: 30, paddingTop: 20 }}
        >
          <Title22>글 쓰기</Title22>
        </View>
        <View style={bgStyle}>
          <ViewRow style={{ paddingHorizontal: 30 }}>
            <Mint13 style={{ paddingVertical: 24, width: 80 }}>제안명</Mint13>
            <TextInput
              value={sTitle}
              autoFocus
              onChangeText={setSTitle}
              placeholderTextColor="#999999"
              style={[textStyle]}
              onSubmitEditing={() => contextRef.current.focus()}
              placeholder="제안명을 입력해 주세요"
            />
          </ViewRow>
          <LineSeperator />
          <ViewRow style={{ paddingHorizontal: 30 }}>
            <Mint13 style={{ width: 80 }}>종료 방법</Mint13>
            <TouchableClosingMethod
              value={closingMethod}
              onChange={setClosingMethod}
              items={options}
            />
          </ViewRow>
        </View>
        <View style={[bgStyle, { marginTop: 10 }]}>
          <View style={{ paddingHorizontal: 30, paddingVertical: 20, flex: 1 }}>
            <Mint13 style={{ paddingBottom: 19 }}>제안 배경</Mint13>
            <AutoGrowingTextInput
              value={sContext}
              multiline
              textAlignVertical="top"
              placeholder="제안 배경을 입력해 주세요"
              placeholderTextColor="#999999"
              onChangeText={setSContext}
              style={[textStyle, { minHeight: 50 }]}
              ref={contextRef}
            />
          </View>
          <LineSeperator />
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 20,
              flex: 1,
            }}
          >
            <Mint13 style={{ paddingBottom: 19 }}>제안 내용</Mint13>
            <AutoGrowingTextInput
              value={sBody}
              multiline
              textAlignVertical="top"
              placeholder="제안 내용을 입력해 주세요"
              placeholderTextColor="#999999"
              onChangeText={setSBody}
              style={[textStyle, { minHeight: 180 }]}
            />
          </View>
          <LineSeperator />
          {imageArr.length > 0 && (
            <>
              <View style={{ marginHorizontal: 30, marginVertical: 20 }}>
                {imageArr.map((o, i) => (
                  <TO0
                    key={i}
                    style={{ marginBottom: 10 }}
                    onLongPress={() => imageLongpressHandler(i)}
                  >
                    <Image
                      source={o}
                      resizeMode="cover"
                      style={{ width: "100%", height: 186 }}
                    />
                  </TO0>
                ))}
              </View>
              <LineSeperator />
            </>
          )}
          {fileArr.length > 0 && (
            <>
              <View style={{ marginHorizontal: 30, marginVertical: 20 }}>
                <Mint13 style={{ marginBottom: 20 }}>파일</Mint13>
                {fileArr.map((o, i) => (
                  <ViewRow style={{ marginBottom: 10 }} key={i}>
                    <Body16 style={{ flex: 1, marginRight: 20 }}>
                      {o.name}
                    </Body16>
                    <TO0 key={i} onPress={() => fileDeleteHandler(i)}>
                      <Image source={iconFormClosed} />
                    </TO0>
                  </ViewRow>
                ))}
              </View>
              <LineSeperator />
            </>
          )}
          <ViewRow style={{ padding: 22 }}>
            <TO1 onPress={addImage}>
              <Mint16 style={{ textAlign: "center" }}>사진 첨부</Mint16>
            </TO1>
            <SmallVerticalDivider />
            <TO1 onPress={fileUploadHandler}>
              <Mint16 style={{ textAlign: "center" }}>파일 첨부</Mint16>
            </TO1>
          </ViewRow>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
