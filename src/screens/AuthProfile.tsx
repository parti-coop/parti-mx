import React from "react";
import { TextProps } from "react-native";
import uuid from "uuid";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { showMessage } from "react-native-flash-message";

import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { TextInput } from "../components/TextInput";
import { Text, Mint13, Title22 } from "../components/Text";
import { View, ViewRow, ViewColumnStretch, V0 } from "../components/View";
import UserProfileBig from "../components/UserProfileBig";

import HeaderOnlyConfirm from "../components/HeaderOnlyConfirm";
import { LineSeperator } from "../components/LineDivider";
import { whiteRoundBg } from "../components/Styles";

import { updateUserName } from "../graphql/mutation";
import { searchDuplicateName } from "../graphql/query";
import { useStore } from "../Store";
import { auth, uploadFileUUIDGetUrl, getUserId } from "../firebase";

const textStyle = {
  fontSize: 16,
  color: "#555555",
  paddingHorizontal: 10,
} as TextProps;
const patternUsername = /^[ㄱ-힣a-zA-Z0-9_]*$/;
export default function AuthProfile() {
  const email = auth.currentUser.email;
  const [, dispatch] = useStore();
  const [userName, setUserName] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState(null);
  const [updateName] = useMutation(updateUserName);
  const { refetch, data } = useQuery(searchDuplicateName, {
    variables: { name: userName },
    fetchPolicy: "network-only",
  });
  const [isInUse, setInUse] = React.useState(false);
  const [debouncedCallback] = useDebouncedCallback(refetch, 1000);
  const warningMsg = `"${userName}": 이미 사용중인 닉네임 입니다.`;

  React.useEffect(() => {
    if (data?.mx_users?.length) {
      setInUse(true);
    } else {
      setInUse(false);
    }
  }, [data]);

  function nicknameHandler(text: string) {
    const test = patternUsername.test(text);
    if (test) {
      setUserName(text);
      if (text.trim().length > 0) {
        debouncedCallback();
      }
    }
  }
  async function saveHandler() {
    if (isInUse) {
      return showMessage({ type: "warning", message: warningMsg });
    }
    if (userName.trim().length === 0) {
      return showMessage({ type: "warning", message: "닉네임을 입력하세요." });
    }
    dispatch({ type: "SET_LOADING", loading: true });
    let url = null;
    if (photoUrl) {
      url = await uploadFileUUIDGetUrl(photoUrl, "profile");
    }
    const userId = await getUserId();
    if (userId === null) {
      return showMessage({
        type: "danger",
        message:
          "서버로 부터 인증을 받지 못했습니다. 관리자에게 문의 바랍니다.",
      });
    }
    await updateName({
      variables: {
        id: userId,
        name: userName,
        photo_url: url,
      },
    });
    dispatch({ type: "SET_USER", user_id: userId });
    dispatch({ type: "SET_LOADING", loading: false });
  }

  return (
    <>
      <HeaderOnlyConfirm onPress={saveHandler} />
      <ViewColumnStretch style={{ alignItems: "stretch", marginTop: 12 }}>
        <KeyboardAwareScrollView>
          <View style={{ marginHorizontal: 30 }}>
            <Title22>프로필</Title22>
            <V0 style={{ marginTop: 50, marginBottom: 30 }}>
              <UserProfileBig url={photoUrl} setUrl={setPhotoUrl} />
            </V0>
          </View>

          <View style={[whiteRoundBg, { marginBottom: 50 }]}>
            <ViewRow style={{ paddingTop: 26, paddingHorizontal: 25 }}>
              <Mint13 style={{ width: 40 }}>닉네임</Mint13>
              <TextInput
                value={userName}
                textContentType="nickname"
                placeholder="닉네임 (한글, 영어, 숫자, _)"
                autoFocus={true}
                returnKeyType="send"
                placeholderTextColor="#c5c5c5"
                maxLength={30}
                onChangeText={nicknameHandler}
                onSubmitEditing={saveHandler}
                style={textStyle}
              />
            </ViewRow>
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 30,
                paddingLeft: 75,
                paddingBottom: 26,
              }}
            >
              {userName.trim().length > 0 &&
                (isInUse ? (
                  <Text style={{ fontSize: 12, color: "#f35f5f" }}>
                    {warningMsg}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 12 }}>
                    "{userName}": 사용가능한 닉네임 입니다.
                  </Text>
                ))}
            </View>
            <LineSeperator />
            <ViewRow style={{ paddingVertical: 26, paddingHorizontal: 25 }}>
              <Mint13 style={{ width: 40 }}>이메일</Mint13>
              <Text style={textStyle}>{email}</Text>
            </ViewRow>
          </View>
        </KeyboardAwareScrollView>
      </ViewColumnStretch>
    </>
  );
}
