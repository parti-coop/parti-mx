import React from "react";
import { ScrollView } from "react-native";
import { RootStackParamList } from "./AppContainer";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSubscription } from "@apollo/react-hooks";

import { Title14, Title24 } from "../components/Text";
import { View, ViewRow } from "../components/View";
import TouchableVoteList from "../components/TouchableVoteList";
import HeaderList from "../components/HeaderList";
import ButtonNew from "../components/ButtonNew";
import { flatWhiteBg } from "../components/Styles";

import { useStore } from "../Store";
import { VoteBoardList } from "../types";
import { subscribePostsByBoardId } from "../graphql/subscription";
import useNavigateToPost from "../components/useNavigateToPost";

export default function VoteList(props: {
  navigation: StackNavigationProp<RootStackParamList, "VoteList">;
  route: RouteProp<RootStackParamList, "VoteList">;
}) {
  const [{ group_id, user_id }, dispatch] = useStore();
  const navigatePost = useNavigateToPost();
  const boardId = props.route.params.id;
  const { data, error, loading } = useSubscription<VoteBoardList>(
    subscribePostsByBoardId,
    {
      variables: { id: boardId, user_id },
    }
  );
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_GROUP", group_id });
  }, [group_id]);
  React.useEffect(() => {
    dispatch({ type: "SET_LOADING", loading });
  }, [loading]);
  const { posts = [], title = "투표 로드 중" } = data?.mx_boards_by_pk ?? {};
  function navigateNew() {
    props.navigation.navigate("VoteNew", { boardId, boardName: title });
  }
  if (error) {
    console.log(error);
  }
  return (
    <>
      <HeaderList />
      <ScrollView>
        <View style={{ paddingHorizontal: 30 }}>
          <Title24>{title}</Title24>
        </View>
        <ViewRow style={{ marginVertical: 20, paddingHorizontal: 30 }}>
          <Title14>진행중인 투표</Title14>
        </ViewRow>
        <View style={flatWhiteBg}>
          {posts.map((post, i) => {
            return (
              <TouchableVoteList
                key={i}
                post={post}
                style={posts.length !== i + 1 && { borderBottomWidth: 1 }}
                onPress={navigatePost}
              />
            );
          })}
        </View>
      </ScrollView>
      <ButtonNew onPress={navigateNew} />
    </>
  );
}
