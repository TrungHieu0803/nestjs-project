import { Test, TestingModule } from '@nestjs/testing';
import { ConversationReplyController } from './conversation-reply.controller';

describe('ConversationReplyController', () => {
  let controller: ConversationReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationReplyController],
    }).compile();

    controller = module.get<ConversationReplyController>(ConversationReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
