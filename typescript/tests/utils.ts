import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from 'expect';
import { TennisGame } from '../src/TennisGame.js';

let scores: Array<[number, number, string]> = [];

export function checkAllScores(tennisGameGetter: () => TennisGame) {
  getAllScores().forEach(([player1Score, player2Score, expectedScore]) => {
    checkScore(tennisGameGetter(), player1Score, player2Score, expectedScore);
  });
}

export function checkScore(game: TennisGame, player1Score: number, player2Score: number, expectedScore: string): void {
  const highestScore = Math.max(player1Score, player2Score);

  for (let i = 0; i < highestScore; i++) {
    if (i < player1Score) {
      game.wonPoint('player1');
    }
    if (i < player2Score) {
      game.wonPoint('player2');
    }
  }

  expect(game.getScore()).toEqual(expectedScore);
}

export function getAllScores(): Array<[number, number, string]> {
  const dirname = fileURLToPath(new URL('.', import.meta.url));

  if (!scores.length) {
    const scoreData = readFileSync(resolve(dirname, 'scores.json')).toString();

    try {
      scores = JSON.parse(scoreData);
    } catch (err) {
      throw new Error(`There was an error parsing the scores: "${(err as Error).message}"`, { cause: err });
    }
  }

  return JSON.parse(JSON.stringify(scores));
}
