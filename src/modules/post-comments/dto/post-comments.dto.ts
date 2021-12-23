

export class PostCommentsDto implements Readonly<PostCommentsDto>{

    commentId: number;

    content: string;

    createdDate: Date;

    user: {
        userId: number,
        fullName: string,
        avatar: string
    };

    replyComment: [ReplyCommentDto]
   
}

export class ReplyCommentDto implements Readonly<ReplyCommentDto>{
    commentId: number;

    content: string;

    createdDate: Date;

    user: {
        userId: number,
        fullName: string,
        avatar: string
    };

}