import { TennisGame } from './TennisGame.js';

interface Result {
  toResult(): string
}

class OngoingResult implements Result {
  constructor(private readonly playerOne: Player, private readonly playerTwo: Player) { }

  toResult(): string {
    return `${this.playerOne.score.getScoreName()}-${this.playerTwo.score.getScoreName()}`;
  }
}

class TieResult implements Result {
  constructor(private readonly score: Score) { }

  toResult(): string {
    if (this.score.isForty()) {
      return 'Deuce';
    }

    return `${this.score.getScoreName()}-All`;
  }
}

class AdvantageResult implements Result {
  constructor(private readonly player: Player) { }

  toResult(): string {
    return `Advantage ${this.player.name}`;
  }
}

class WinResult implements Result {
  constructor(private readonly player: Player) { }

  toResult(): string {
    return `Win for ${this.player.name}`;
  }
}

class InitialResult extends TieResult {
  constructor() {
    super(new Score());
  }
}


class Score {
  private current!: ScoreLabel
  private readonly scoreLabels = scores();

  constructor() {
    this.increment()
  }

  increment(): void {
    this.current = this.scoreLabels.next().value
  }

  isForty(): boolean {
    return this.current === 'Forty';
  }

  equals(score: Score): boolean {
    return this.current === score.current;
  }

  getScoreName(): string {
    return this.current;
  }
}

type ScoreLabel = 'Love' | 'Fifteen' | 'Thirty' | 'Forty';

function* scores(): Generator<ScoreLabel> {
  yield 'Love';
  yield 'Fifteen';
  yield 'Thirty';

  while (true) {
    yield 'Forty';
  }
}

class Player {
  constructor(readonly name: string, readonly score = new Score()) { }

  isTieWith(player: Player): boolean {
    return this.score.equals(player.score);
  }

  isDeuceWith(player: Player): boolean {
    return this.score.isForty() && player.score.isForty();
  }
}

class NoPlayer extends Player {
  constructor() {
    super('No player');
  }
}


export class TennisGame1 implements TennisGame {
  private readonly playerOne: Player;
  private readonly playerTwo: Player;

  private playerWithAdvantage: Player
  private result: Result;

  constructor(playerOneName: string, playerTwoName: string) {
    this.playerOne = new Player(playerOneName);
    this.playerTwo = new Player(playerTwoName);

    this.playerWithAdvantage = new NoPlayer();
    this.result = new InitialResult();
  }


  wonPoint(playerName: string): void {
    const player = this.findPlayer(playerName);

    if (this.isGameOver() || !this.isPlayerInTheGame(player)) {
      return;
    }

    if (this.hasAdvantage(player)) {
      return this.setWinResult(player);
    }

    if (this.hasAdvantage(this.getOpponent(player))) {
      return this.setTieResult();
    }

    if (this.playerOne.isDeuceWith(this.playerTwo)) {
      return this.setAdvantageResult(player);
    }

    if (player.score.isForty()) {
      return this.setWinResult(player);
    }

    this.addPointTo(player);
  }

  getScore(): string {
    return this.result.toResult();
  }

  private findPlayer(playerName: string) {
    if (this.playerOne.name === playerName) {
      return this.playerOne;
    }

    if (this.playerTwo.name === playerName) {
      return this.playerTwo;
    }

    return new NoPlayer();
  }


  private isGameOver(): boolean {
    return this.result instanceof WinResult;
  }

  private isPlayerInTheGame(player: Player): boolean {
    return !(player instanceof NoPlayer);
  }

  private getOpponent(player: Player): Player {
    return player === this.playerOne ? this.playerTwo : this.playerOne;
  }

  private setTieResult(): void {
    this.result = new TieResult(this.playerOne.score);
    this.playerWithAdvantage = new NoPlayer();
  }

  private setAdvantageResult(player: Player): void {
    this.playerWithAdvantage = player;
    this.result = new AdvantageResult(player);
  }

  private setWinResult(player: Player): void {
    this.result = new WinResult(player);
    this.playerWithAdvantage = new NoPlayer();
  }

  private addPointTo(player: Player): void {
    player.score.increment();

    if (this.playerOne.isTieWith(this.playerTwo)) {
      this.result = new TieResult(player.score);
    } else {
      this.result = new OngoingResult(this.playerOne, this.playerTwo);
    }
  }

  private hasAdvantage(player: Player): boolean {
    return this.playerWithAdvantage === player;
  }
}
