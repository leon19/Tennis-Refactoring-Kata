import { TennisGame } from './TennisGame.js';


interface Result {
  toResult(): string
}

class OngoingResult implements Result {
  constructor(private readonly playerOneScore: Score, private readonly playerTwoScore: Score) {}

  toResult(): string {
    return `${this.playerOneScore.getScoreName()}-${this.playerTwoScore.getScoreName()}`;
  }
}


class TieResult implements Result {
  constructor(private readonly score: Score) {}

  toResult(): string {
    if (this.score.getPoints() < 3) {
      return this.score.getScoreName() + '-All';
    }

    return 'Deuce';
  }
}

class AdvantageResult implements Result {
  constructor(private readonly player: Player) {}

  toResult(): string {
    return `Advantage ${this.player.name}`;
  }
}

class WinResult implements Result {
  constructor(private readonly player: Player) {}

  toResult(): string {
    return `Win for ${this.player.name}`;
  }
}


class Score {
  constructor(private points = 0) {}

  increment(): void {
    this.points += 1;
  }

  equals(score: Score): boolean {
    return this.points === score.points;
  }

  getPoints(): number {
    return this.points;
  }

  getScoreName(): string {
    return scoreMap[this.points] as string;
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

  isTiedWith(player: Player): boolean {
    return this.score.equals(player.score);
  }

  hasAdvantageOver(player: Player): boolean {
    return this.score.getPoints() >= 4  && this.score.getPoints() - player.score.getPoints() === 1;
  }

  hasWonOver(player: Player): boolean {
    return this.score.getPoints() >= 4  && this.score.getPoints() - player.score.getPoints() >= 2;
  }
}


export class TennisGame1 implements TennisGame {
  private readonly playerOne: Player;
  private readonly playerTwo: Player;

  private readonly players = new Map<string, Player>();

  constructor(playerOneName: string, playerTwoName: string) {
    this.playerOne = new Player(playerOneName);
    this.playerTwo = new Player(playerTwoName);

    this.players.set(playerOneName, this.playerOne);
    this.players.set(playerTwoName, this.playerTwo);
  }

  wonPoint(playerName: string): void {
    this.players.get(playerName)?.score.increment();
  }

  getScore(): string {
    if (this.playerOne.isTiedWith(this.playerTwo)) {
      return new TieResult(this.playerOne.score).toResult();
    }

    if (this.playerOne.hasAdvantageOver(this.playerTwo)) {
      return new AdvantageResult(this.playerOne).toResult();
    }

    if (this.playerTwo.hasAdvantageOver(this.playerOne)) {
      return new AdvantageResult(this.playerTwo).toResult();
    }

    if (this.playerOne.hasWonOver(this.playerTwo)) {
      return new WinResult(this.playerOne).toResult();
    }

    if (this.playerTwo.hasWonOver(this.playerOne)) {
      return new WinResult(this.playerTwo).toResult();
    }

    return new OngoingResult(this.playerOne.score, this.playerTwo.score).toResult();
  }
}

