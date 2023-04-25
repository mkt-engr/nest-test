import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { create } from 'domain';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    })
      .useMocker(createMock) //テストモジュールで定義していない依存関係をモックできる（ここではHttpService）
      .compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
  });

  describe('ポケモンの取得', () => {
    it(`ポケモンIDが1より小さい場合はエラーになること`, async () => {
      //実行
      const getPokemon = pokemonService.getPokemon(0);

      //検証
      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it(`ポケモンIDが151より大きい場合はエラーになること`, async () => {
      //実行（awaitはつけず、あえてPromiseを解決せずにアサーションでプロミスを解決する）
      const getPokemon = pokemonService.getPokemon(152);

      //検証
      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it(`ポケモンの名前を返す有効なポケモンIDだった場合`, async () => {
      //準備
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          species: { name: `bulbasaur` },
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      //実行
      const getPokemon = pokemonService.getPokemon(1);

      //検証
      await expect(getPokemon).resolves.toBe(`bulbasaur`);
    });

    it(`ポケモンAPIに変更があり想定外のレスポンスがあった場合エラーを返す`, async () => {
      //準備
      httpService.axiosRef.mockResolvedValueOnce({
        data: `Unexpected data`,
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      //実行
      const getPokemon = pokemonService.getPokemon(1);

      //検証
      await expect(getPokemon).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
