import React from "react";
import { Keyboard } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useMutation } from "@apollo/react-hooks";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { launchImageLibraryAsync } from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/src/ImagePicker.types";
import * as DocumentPicker from "expo-document-picker";
import { RootStackParamList } from "./AppContainer";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { Title22, Mint13 } from "../components/Text";
import { TextInput } from "../components/TextInput";
import HeaderConfirm from "../components/HeaderConfirm";
import { View, ViewRow } from "../components/View";
import ToggleBox from "../components/ToggleBox";
import { LineSeperator } from "../components/LineDivider";
import HeaderBreadcrumb from "../components/HeaderBreadcrumb";
import { bgStyle, textStyle } from "../components/Styles";
import BottomImageFile from "../components/BottomImageFile";
import ViewNewImageFile from "../components/ViewNewImageFile";
import CandidateEdit from "../components/CandidateEdit";
import TouchableClosingMethod from "../components/TouchableClosingMethod";

import { File } from "../types";
import { uploadFileUUID } from "../firebase";
import { useStore } from "../Store";
import { insertPost } from "../graphql/mutation";
function promiseArray(o: ImageInfo | File) {
  return new Promise(async function (res) {
    const uri = await uploadFileUUID(o.uri, "posts").then((snap) =>
      snap.ref.getDownloadURL()
    );
    res({ ...o, uri });
  });
}

export default function VoteNew(props: {
  navigation: StackNavigationProp<RootStackParamList, "SuggestionNew">;
  route: RouteProp<RootStackParamList, "SuggestionNew">;
}) {
  const { boardId, boardName } = props.route.params;
  const [insert, { loading }] = useMutation(insertPost);
  const [{ group_id }, dispatch] = useStore();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [candidates, setCandidates] = React.useState(["", ""]);
  const [isBinary, setBinary] = React.useState(false);
  const [isMultiple, setMultiple] = React.useState(false);
  const [isAnonymous, setAnonymous] = React.useState(false);
  const [closingMethod, setClosingMethod] = React.useState("3days");
  const [imageArr, setImageArr] = React.useState<Array<ImageInfo | undefined>>(
    []
  );
  const [fileArr, setFileArr] = React.useState<Array<File>>([]);
  const contextRef = React.useRef(null);
  const scrollRef = React.useRef(null);

  const { navigate } = useNavigation();
  function resetInput() {
    setTitle("");
    setBody("");
    setImageArr([]);
    setFileArr([]);
  }
  useFocusEffect(
    React.useCallback(() => {
      return resetInput;
    }, [])
  );
  async function imageUploadHandler() {
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
    const { type, ...rest } = file;
    if (type === "success") {
      setFileArr([...fileArr, rest as File]);
    }
  }

  async function insertPressHandler() {
    if (!title.trim()) {
      return showMessage({
        message: "투표명을 입력해주세요.",
        type: "warning",
      });
    }
    if (title?.trim()?.length > 20) {
      return showMessage({
        message: "투표명을 20자 이내로 입력해주세요.",
        type: "warning",
      });
    }
    if (!body?.trim()) {
      return showMessage({
        message: "투표 내용을 입력해주세요.",
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
        title,
        body,
        board_id: boardId,
        group_id,
        metadata: { isBinary },
        images,
        files,
      },
    });

    navigate("SuggestionList");
  }
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading });
  }, [loading]);

  return (
    <>
      <HeaderConfirm onPress={insertPressHandler} />
      <KeyboardAwareScrollView ref={scrollRef}>
        <HeaderBreadcrumb boardName={boardName} />
        <View
          style={{ paddingHorizontal: 28, paddingBottom: 30, paddingTop: 20 }}
        >
          <Title22>글 쓰기</Title22>
        </View>
        <View style={bgStyle}>
          <ViewRow style={{ paddingHorizontal: 30 }}>
            <Mint13 style={{ paddingVertical: 15, width: 80 }}>
              투표 제목*
            </Mint13>
            <TextInput
              value={title}
              autoFocus
              onChangeText={setTitle}
              placeholderTextColor="#999999"
              style={[textStyle]}
              onSubmitEditing={() => contextRef.current.focus()}
              placeholder="제목 입력"
            />
          </ViewRow>
          <LineSeperator />
          <ViewRow
            style={{ paddingHorizontal: 30, justifyContent: "space-between" }}
          >
            <Mint13 style={{ width: 80, paddingVertical: 15 }}>
              찬반투표 사용
            </Mint13>
            <ToggleBox value={isBinary} changeHandler={setBinary} />
          </ViewRow>
        </View>
        {!isBinary && (
          <View style={[bgStyle, { marginTop: 10 }]}>
            <View
              style={{ paddingHorizontal: 30, paddingVertical: 20, flex: 1 }}
            >
              <Mint13 style={{}}>투표 항목</Mint13>
              <CandidateEdit values={candidates} setValues={setCandidates} />
            </View>
          </View>
        )}
        <View style={[bgStyle, { marginTop: 10 }]}>
          <ViewRow
            style={{ paddingHorizontal: 30, justifyContent: "space-between" }}
          >
            <Mint13 style={{ width: 80, paddingVertical: 15 }}>종료일</Mint13>
            <TouchableClosingMethod
              value={closingMethod}
              onChange={setClosingMethod}
              items={[
                { label: "7일 후 종료", value: "7days" },
                { label: "3일 후 종료", value: "3days" },
                { label: "토론 정리시 종료", value: "manual" },
              ]}
            />
          </ViewRow>
          <LineSeperator />
          <ViewRow
            style={{ paddingHorizontal: 30, justifyContent: "space-between" }}
          >
            <Mint13 style={{ width: 80, paddingVertical: 15 }}>
              복수 투표
            </Mint13>
            <ToggleBox value={isMultiple} changeHandler={setMultiple} />
          </ViewRow>
          <LineSeperator />
          <ViewRow
            style={{ paddingHorizontal: 30, justifyContent: "space-between" }}
          >
            <Mint13 style={{ width: 80, paddingVertical: 15 }}>
              익명 투표
            </Mint13>
            <ToggleBox value={isAnonymous} changeHandler={setAnonymous} />
          </ViewRow>
        </View>
        <View style={[bgStyle, { marginTop: 10 }]}>
          <View style={{ paddingHorizontal: 30, paddingVertical: 20, flex: 1 }}>
            <Mint13 style={{ paddingBottom: 10 }}>투표 내용</Mint13>
            <AutoGrowingTextInput
              value={body}
              multiline
              textAlignVertical="top"
              placeholder="투표 내용을 입력해 주세요"
              placeholderTextColor="#999999"
              onChangeText={setBody}
              style={[textStyle, { minHeight: 100 }]}
            />
          </View>
          <LineSeperator />
          <ViewNewImageFile
            imageArr={imageArr}
            fileArr={fileArr}
            setFileArr={setFileArr}
            setImageArr={setImageArr}
          />
          <BottomImageFile
            onFile={fileUploadHandler}
            onImage={imageUploadHandler}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
