import React from "react";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Text } from "../components/Text";
import { useStore } from "../Store";
import { TOEasy } from "../components/TouchableOpacity";
import ViewGroupHome from "../components/ViewGroupHome";

export default () => {
  const navigation = useNavigation();
  const [{ group_id, user_id }] = useStore();
  React.useEffect(() => {
    if (group_id === null) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }, [navigation.dispatch]);
  if (group_id !== null && user_id !== null) {
    return <ViewGroupHome />;
  } else {
    return (
      <TOEasy onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Text>그룹을 선택하세요.</Text>
      </TOEasy>
    );
  }
};
