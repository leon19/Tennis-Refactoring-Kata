import { TennisGame } from './TennisGame.js';


class Score {
  constructor(private score = 0) {}

  increment(): void {
    this.score += 1;
  }

  equals(score: Score): boolean {
    return this.score === score.score;
  }

  valueOf(): number {
    return this.score;
  }

  toString(): string {
    return scoreMap[this.score] as string;
  }
}


const scoreMap: Record<number, string> = {
  0: 'Love',
  1: 'Fifteen',
  2: 'Thirty',
  3: 'Forty'
};


class Player {
  constructor(readonly name:string, readonly score = new Score()) {}

  hasName(name: string): boolean {
    return this.name === name;
  }
}


export class TennisGame1 implements TennisGame {
  private readonly playerOne: Player;
  private readonly playerTwo: Player;

  constructor(playerOneName: string, playerTwoName: string) {
    this.playerOne = new Player(playerOneName);
    this.playerTwo = new Player(playerTwoName);

  }

  wonPoint(playerName: string): void {
    if (this.playerOne.hasName(playerName)) {
      this.playerOne.score.increment();
    } else {
      this.playerTwo.score.increment();
    }
  }

  getScore(): string {
    if (this.arePlyersTied()) {
      return this.findTieScore();
    }

     if (this.hasPlayerOneWon() || this.hasPlayerTwoWon()) {
      return this.findWonScore();
    }

    return this.findOngoingScore();
  }

  private hasPlayerTwoWon(): boolean {
    return this.playerTwo.score.valueOf() >= 4;
  }

  private hasPlayerOneWon(): boolean{
    return this.playerOne.score.valueOf() >= 4;
  }

  private arePlyersTied() {
    return this.playerOne.score.equals(this.playerTwo.score);
  }

  private findOngoingScore() {
    return `${this.playerOne.score}-${this.playerTwo.score}`;
  }

  private findWonScore() {
    const minusResult = this.playerOne.score.valueOf() - this.playerTwo.score.valueOf();

    if (minusResult === 1) {
      return 'Advantage player1';
    }

    if (minusResult === -1) {
      return 'Advantage player2';
    }

    if (minusResult >= 2) {
      return 'Win for player1';
    }

    return 'Win for player2';
  }

  private findTieScore(): string{
    switch (this.playerOne.score.valueOf()) {
      case 0:
        return 'Love-All';
      case 1:
        return 'Fifteen-All';
      case 2:
        return 'Thirty-All';
      default:
        return 'Deuce';
    }
  }
}

