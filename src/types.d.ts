export type Board = {
  id: number;
  title: string;
  body: string;
  permission: string;
  type: string;
  updated_at: string;
  last_posted_at: string;
  users: Array<{ updated_at: string }>;
  newPostCount?: number;
};

export interface Comment {
  id: number;
  body: string;
  updated_at: string;
  user: User;
  likes: [
    {
      user: User;
    }
  ];
  likes_aggregate: {
    aggregate: {
      count: number;
    };
  };
  re?: Comment[];
  post?: VoteDetailType;
}

export type PostListType = {
  id: number;
  title: string;
  body: string;
  metadata: { closedAt: string; closingMethod: string };
  created_at: string;
  updated_at: string;
  users_aggregate: {
    aggregate: {
      sum: {
        like_count: number;
      };
    };
  };
  users: Array<{ like_count: number; updated_at: string }>;
  updatedBy: User;
  createdBy: User;
  comments_aggregate: {
    aggregate: {
      count: number;
    };
  };
};
export type SuggestionListType = PostListType;
type VoteMetadata = {
  closedAt?: string;
  closingMethod: string;
  isBinary: boolean;
  isMultiple: boolean;
  isAnonymous: boolean;
  isResultHidden: boolean;
};
type EventMetadata = {
  eventDate: string;
  place: string;
  deadline: string;
  countPeople: number;
};
export interface VoteListType extends PostListType {
  metadata: VoteMetadata;
}
export interface EventListType extends PostListType {
  metadata: EventMetadata;
}

export type User = {
  id: number;
  name: string;
  photo_url: string;
  email?: string;
  checkedPosts?: [{ like_count: number }];
  votes?: Vote[];
};

export interface UserGroup {
  user: User;
  status: string;
  created_at: string;
}

export type PostDetailType = {
  id: number;
  title: string;
  body: string;
  metadata: any;
  images: any;
  files: any;
  updatedBy: User;
  createdBy: User;
  created_at: string;
  updated_at: string;
  comments: Comment[];
  meLiked: {
    like_count: number;
  }[];
  board: {
    title: string;
    type: string;
  };
};
export interface SuggestionDetailType extends PostDetailType {
  likedUsers: {
    created_at: string;
    user: User;
  }[];
  context: string;
}
export interface EventDetailType extends PostDetailType {
  likedUsers: {
    created_at: string;
    user: User;
  }[];
  metadata: EventMetadata;
}
export interface NoticeDetailType extends PostDetailType {
  users_aggregate: {
    aggregate: {
      sum: {
        like_count: number;
      };
    };
  };
}
export type Vote = {
  user: User;
  count: number;
  created_at: string;
  candidate: Candidate;
};

export type Candidate = {
  id: number;
  body: string;
  post: {
    id: number;
    metadata: VoteMetadata;
  };
  votes_aggregate: {
    aggregate: {
      sum: {
        count: number;
      };
    };
  };
  myVote: [
    {
      count: number;
      created_at?: string;
      user?: User;
    }
  ];
  votes: Vote[];
};
export interface VoteDetailType extends PostDetailType {
  users_aggregate: {
    aggregate: {
      sum: {
        like_count: number;
      };
    };
  };
  candidates: Candidate[];
  metadata: VoteMetadata;
}

export type RecommentArgs = {
  id: number;
  user: Comment["user"];
  reUser?: Comment["user"];
};

export interface File {
  name: string;
  size: number;
  uri: string;
  lastModified?: number;
  file?: File;
}

export interface SearchResultType {
  id: number;
  title: string;
  created_at: string;
  createdBy: {
    id: number;
    name: string;
  };
  board: {
    type: string;
    title: string;
  };
}

export interface GroupBoardNewPostCount {
  get_new_post_count: {
    board_id: number;
    new_count: number;
  }[];
}
