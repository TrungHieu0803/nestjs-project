import { Test, TestingModule } from '@nestjs/testing';
import { ConversationReplyService } from './conversation-reply.service';

describe('ConversationReplyService', () => {
  let service: ConversationReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationReplyService],
    }).compile();

    service = module.get<ConversationReplyService>(ConversationReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
