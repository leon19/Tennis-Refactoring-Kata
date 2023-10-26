import { TennisGame } from './TennisGame.js';


export class TennisGame1 implements TennisGame {
  private playerOneScore: number = 0;
  private playerTwoScore: number = 0;
  private playerOneName: string;
  private playerTwoName: string;


  constructor(playerOneName: string, playerTwoName: string) {
    this.playerOneName = playerOneName;
    this.playerTwoName = playerTwoName;
  }

  wonPoint(playerName: string): void {
    if (playerName === 'player1')
      this.playerOneScore += 1;
    else
      this.playerTwoScore += 1;
  }

  getScore(): string {
    if (this.playerOneScore === this.playerTwoScore) {
      return this.findTieScore();
    }

     if (this.playerOneScore >= 4 || this.playerTwoScore >= 4) {
      return this.findWonScore();
    }

    return this.findOngoingScore();
  }

  private findOngoingScore() {
    let score = '';
    let tempScore = 0;


    for (let i = 1; i < 3; i++) {
      if (i === 1) tempScore = this.playerOneScore;
      else { score += '-'; tempScore = this.playerTwoScore; }
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
    const minusResult = this.playerOneScore - this.playerTwoScore;

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
    switch (this.playerOneScore) {
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
