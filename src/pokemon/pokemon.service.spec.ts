import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpModule } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';

describe('PokemonService', () => {
  let pokemonService: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PokemonService],
    }).compile();

    pokemonService = module.get<PokemonService>(PokemonService);
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
      //実行
      const getPokemon = pokemonService.getPokemon(1);

      //検証
      await expect(getPokemon).resolves.toBe(`bulbasaur`);
    });
  });
});
