export type Board = {
  id: number;
  title: string;
  body: string;
  permission: string;
  type: string;
  updated_at: string;
  last_posted_at: string;
  users: Array<{ updated_at: string }>;
};

export interface Comment {
  id: number;
  body: string;
  updated_at: string;
  user: { name: string; checkedPosts?: [{ count: number }]; photo_url: string };
  likes: [
    {
      user: {
        name: string;
      };
    }
  ];
  likes_aggregate: {
    aggregate: {
      count: number;
    };
    nodes: {
      user: {
        name: string;
      };
    };
  };
  re?: Comment[];
}

export type PostListType = {
  id: number;
  title: string;
  body: string;
  metadata: { closed_at: string; closingMethod: number };
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
  updatedBy: {
    name: string;
  };
  comments_aggregate: {
    aggregate: {
      count: number;
    };
  };
};
export type SuggestionListType = PostListType;

export type User = {
  name: string;
  photo_url: string;
};

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
  };
};
export interface SuggestionDetailType extends PostDetailType {
  likedUsers: {
    created_at: string;
    user: User;
  }[];
  context: string;
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
