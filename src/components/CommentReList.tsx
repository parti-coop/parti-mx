import React from "react";
import { ViewStyle } from "react-native";
import Modal from "react-native-modal";

import UserCommentProfile from "./UserCommentProfile";
import { View, ViewRow, V0, ViewRowCenter } from "./View";
import { Text, Grey12, Body16, Red16, Mint13, Blue12 } from "./Text";
import { TO1, TO0 } from "./TouchableOpacity";
import ButtonLikeComment from "./ButtonLikeComment";
import ButtonComment from "./ButtonComment";
import ButtonUnlikeComment from "./ButtonUnlikeComment";
import SelectMenu from "./SelectMenu";
import useCommentDelete from "./useCommentDelete";
import useReport from "./useReport";
import { whiteRoundBg } from "./Styles";
import { boardTypes } from "./boardTypes";

import { Comment } from "../types";
import { useStore } from "../Store";
import { formatDateFromString } from "../Utils/CalculateDays";
import Hyperlink from "./Hyperlink";

const commentModal = {
  width: 315,
  height: 171,
  ...(whiteRoundBg as Object),
  paddingHorizontal: 30,
  paddingTop: 40,
  paddingBottom: 10,
} as ViewStyle;
export default function CommentReList(props: {
  comment: Comment;
  edit: (arg: { body: string; id: number }) => void;
  recomment: (args: { reUser: Comment["user"] }) => void;
  style?: ViewStyle;
}) {
  const { comment, edit: editHandler, style, recomment } = props;
  const { id, body, likes_aggregate, user, updated_at, likes, post } = comment;
  const [isVisible, setVisible] = React.useState(false);
  const [{ user_id }] = useStore();
  const [report] = useReport(id, "comment");
  const [deleteComment] = useCommentDelete(id);
  function recommentHandler() {
    recomment({ reUser: user });
  }
  function deleteHandler() {
    deleteComment();
    setVisible(false);
  }
  const options = [
    {
      label: "수정하기",
      handler: function () {
        editHandler({ body, id });
      },
    },
    { label: "삭제하기", handler: () => setVisible(true) },
  ];
  let attitude = null;
  if (user?.checkedPosts?.[0]?.like_count) {
    if (post?.board?.type === boardTypes.EVENT) {
      attitude = "참석";
    } else if (post?.board?.type === boardTypes.SUGGESTION) {
      attitude = "동의";
    } else {
      attitude = "동의";
    }
  } else if (user?.votes?.length > 0) {
    if (post.metadata.isAnonymous !== true) {
      attitude = user.votes.map((v) => v.candidate.body).join(",");
    }
  }
  return (
    <View
      style={[
        {
          marginTop: 15,
          paddingTop: 15,
          paddingLeft: 25,
          borderTopWidth: 1,
          borderTopColor: "#e4e4e4",
        },
        style,
      ]}
    >
      <ViewRow>
        <UserCommentProfile
          name={user.name}
          photoUrl={user.photo_url}
          style={{ flexShrink: 1 }}
        />
        <Blue12 style={{ marginLeft: 5 }}>{attitude}</Blue12>
        <Grey12 style={{ marginLeft: 5, fontFamily: "notosans700" }}>
          {formatDateFromString(updated_at)}
        </Grey12>
        {user.id === user_id && <SelectMenu items={options} />}
      </ViewRow>
      <View style={{ marginVertical: 10 }}>
        <Hyperlink text={body} />
      </View>
      <ViewRow>
        <ButtonComment recomment={recommentHandler} />
        <TO0 style={{ marginLeft: 20 }} onPress={report}>
          <Mint13>신고하기</Mint13>
        </TO0>
        {likes[0] ? (
          <ButtonUnlikeComment
            style={{ right: 0, position: "absolute" }}
            id={id}
            count={likes_aggregate.aggregate.count}
          />
        ) : (
          <ButtonLikeComment
            style={{ right: 0, position: "absolute" }}
            id={id}
            count={likes_aggregate.aggregate.count}
          />
        )}
      </ViewRow>
      <Modal
        isVisible={isVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setVisible(false)}
      >
        <V0>
          <View style={commentModal}>
            <Body16>이 댓글을 삭제 하시겠습니까?</Body16>
            <ViewRowCenter style={{ marginTop: 30 }}>
              <TO1 style={{ padding: 20 }} onPress={() => setVisible(false)}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#999999",
                    fontFamily: "notosans700",
                  }}
                >
                  취소
                </Text>
              </TO1>
              <View
                style={{ width: 1, height: 13, backgroundColor: "#d6d6d6" }}
              />
              <TO1 style={{ padding: 20 }} onPress={deleteHandler}>
                <Red16 style={{ fontFamily: "notosans700" }}>삭제</Red16>
              </TO1>
            </ViewRowCenter>
          </View>
        </V0>
      </Modal>
    </View>
  );
}
