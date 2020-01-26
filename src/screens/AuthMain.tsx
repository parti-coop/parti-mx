import React from "react";
import { NavigationSwitchScreenProps } from "react-navigation";
import { View } from "react-native";
import { useStore } from "../Store";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
export default (props: NavigationSwitchScreenProps) => {
  const { navigate } = props.navigation;
  const [store, dispatch] = useStore();
  function register() {
    userTokenHandler();
  }
  function login() {
    userTokenHandler();
  }
  function userTokenHandler() {
    dispatch({ type: "SET_TOKEN", userToken: "custom-user-token-to-be-made" });
    navigate("Home");
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Auth Screen</Text>
      <Text>인증</Text>
      <Text>{store.userToken}</Text>
      <Button title="신규 이용자 회원가입" onPress={register} />
      <Button title="기존 이용자 로그인" onPress={login} />
    </View>
  );
};
