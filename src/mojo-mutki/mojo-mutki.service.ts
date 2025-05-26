import { Injectable } from '@nestjs/common';

@Injectable()
export class MojoMutkiService {
  simulate(initialMojos = 10): number {
    let mojos = initialMojos;
    let mutkis = 0;
    let totalEaten = 0;

    const EXCHANGE_RATE = 3;

    while (mojos > 0) {
      mutkis += mojos;
      totalEaten += mojos;
      mojos = 0;

      const newMojos = Math.floor(mutkis / EXCHANGE_RATE);
      mutkis = mutkis % EXCHANGE_RATE;
      mojos += newMojos;
    }

    return totalEaten;
  }
}
