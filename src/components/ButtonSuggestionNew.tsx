import React from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity } from "./TouchableOpacity";
// import { Text } from "./Text";

import btnFloatingWrite from "../../assets/btnFloatingWrite.png";

const rectangle3Copy3 = {
  width: 56,
  height: 51,
  borderRadius: 18,
  backgroundColor: "#30ad9f",
  shadowColor: "rgba(0, 0, 0, 0.35)",
  elevation: 1,
  shadowOffset: {
    width: -1.8,
    height: -2.4,
  },
  shadowRadius: 7,
  shadowOpacity: 1,
};
export default () => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate("SuggestionNew")}
      style={[
        rectangle3Copy3,
        {
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 10,
          right: 16,
        },
      ]}
    >
      <Image source={btnFloatingWrite} />
    </TouchableOpacity>
  );
};
