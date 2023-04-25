import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';

describe('TweetsService', () => {
  let service: TweetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsService],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ツイートの作成', () => {
    it('ツイートが作られるかどうか', () => {
      //Arrange（準備）
      service.tweets = [];
      const payload = 'This is my tweet';

      //Act（実行）
      const tweet = service.createTweet(payload);

      //Assert（検証）
      expect(tweet).toBe(payload);
      expect(service.tweets).toHaveLength(1);
    });

    it('100文字以上のツイートは作成されないこと', () => {
      //Arrange（準備）
      const payload = 'This is a long tweet over 100 characters'.repeat(10);

      //Act（実行）
      const tweet = () => {
        return service.createTweet(payload);
      };

      //Assert（検証）
      expect(tweet).toThrowError();
    });
  });

  describe('ツイートの更新', () => {
    it('更新内容が空の場合はエラーを返すこと', () => {
      //準備
      const payload = ``;

      //実行
      const updatedTweet = () => {
        return service.updateTweet(payload, 1);
      };

      //検証
      expect(updatedTweet).toThrowError();
    });

    it('更新内容が100文字以上の場合はエラーを返すこと', () => {
      //準備
      const payload = `1234567890`.repeat(11);

      //実行
      const updatedTweet = () => {
        return service.updateTweet(payload, 0);
      };

      //検証
      expect(updatedTweet).toThrowError();
    });

    it('ツイートが更新されること', () => {
      //準備
      service.tweets = [`あああ`];
      const payload = `更新`;

      //実行
      const id = 0;
      const updatedTweet = service.updateTweet(payload, id);
      console.log(updatedTweet);

      //検証
      expect(updatedTweet).toEqual(payload);
    });
  });
});
