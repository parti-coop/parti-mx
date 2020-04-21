import React from "react";
import { ScrollView } from "react-native";
import { RootStackParamList } from "./AppContainer";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSubscription } from "@apollo/react-hooks";

import { Text } from "../components/Text";
import { View, ViewRow } from "../components/View";
import { TouchableOpacity } from "../components/TouchableOpacity";
import TouchableSuggestionList from "../components/TouchableSuggestionList";
import HeaderList from "../components/HeaderList";
import ButtonSuggestionNew from "../components/ButtonSuggestionNew";

import { useStore } from "../Store";
import { subscribepostsByBoardId } from "../graphql/subscription";

export default (props: {
  navigation: StackNavigationProp<RootStackParamList, "SuggestionList">;
  route: RouteProp<RootStackParamList, "SuggestionList">;
}) => {
  const [store, dispatch] = useStore();
  const board_id = props.route.params.id;
  const { group_id, user_id } = store;
  const { data, loading } = useSubscription(subscribepostsByBoardId, {
    variables: { id: board_id, userId: user_id },
  });
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_GROUP_AND_BOARD", group_id, board_id });
  }, [group_id, board_id]);
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading });
  }, [loading]);
  if (!data?.mx_boards_by_pk) {
    return null;
  }
  const { posts, title } = data.mx_boards_by_pk;
  return (
    <>
      <HeaderList />
      <ScrollView>
        <View style={{ paddingHorizontal: 30 }}>
          <Text
            style={{
              fontSize: 24,
              color: "#333333",
            }}
          >
            {title}🌱
          </Text>
        </View>

        <ViewRow
          style={{
            justifyContent: "space-between",
            marginVertical: 20,
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              textAlign: "left",
              color: "#333333",
            }}
          >
            진행중인 제안
          </Text>
        </ViewRow>
        <View
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            marginHorizontal: 30,
            borderRadius: 25,
            marginBottom: 60,
          }}
        >
          {posts.map((sugg: any, i: number) => {
            return <TouchableSuggestionList key={i} suggestion={sugg} />;
          })}
        </View>
      </ScrollView>
      <ButtonSuggestionNew />
    </>
  );
};
