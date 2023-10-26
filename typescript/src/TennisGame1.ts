import { TennisGame } from './TennisGame.js';


class Player {
  constructor(readonly name:string, private  score = 0) {}

  hasName(name: string): boolean {
    return this.name === name;
  }

  incrementScore(): void {
    this.score += 1;
  }

  getScore(): number {
    return this.score;
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
      this.playerOne.incrementScore();
    } else {
      this.playerTwo.incrementScore();
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
    return this.playerTwo.getScore() >= 4;
  }

  private hasPlayerOneWon(): boolean{
    return this.playerOne.getScore() >= 4;
  }

  private arePlyersTied() {
    return this.playerOne.getScore() === this.playerTwo.getScore();
  }

  private findOngoingScore() {
    let score = '';
    let tempScore: number = 0;


    for (let i = 1; i < 3; i++) {
      if (i === 1) tempScore = this.playerOne.getScore();
      else { score += '-'; tempScore = this.playerTwo.getScore(); }
      switch (tempScore) {
        case 0:
          score += 'Love';
          break;
        case 1:
          score += 'Fifteen';
          break;
        case 2:
          score += 'Thirty';
          break;
        case 3:
          score += 'Forty';
          break;
      }
    }
    return score;
  }

  private findWonScore() {
    const minusResult = this.playerOne.getScore() - this.playerTwo.getScore();

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
    switch (this.playerOne.getScore()) {
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
