import { Module } from '@nestjs/common';
import { ConversationReplyController } from './conversation-reply.controller';
import { ConversationReplyService } from './conversation-reply.service';

@Module({
  controllers: [ConversationReplyController],
  providers: [ConversationReplyService]
})
export class ConversationReplyModule {}
