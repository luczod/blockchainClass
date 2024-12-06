import { hash, isHashProofed } from './helpers';
import { TBlock, THashProof, TMinedBlock } from './typing';

export class Blockchain {
  _chain: TBlock[] = [];
  //  Proof-of-Work(PoW)
  private powPrefix = '0';

  constructor(private readonly difficulty: number = 4) {
    this._chain.push(this.createBlockGenesis());
  }

  private createBlockGenesis(): TBlock {
    const payload: TBlock['payload'] = {
      sequence: 0,
      timestamp: +new Date(), // new Date().getTime()
      data: 'Genesis Block',
      previousHash: '',
    };

    return {
      header: {
        nonce: 0,
        blockHash: hash(JSON.stringify(payload)),
      },
      payload,
    };
  }

  private get lastBlock(): TBlock {
    return this._chain.at(-1) as TBlock;
  }

  get chain() {
    return this._chain;
  }

  private getPreviousBlockHash(): string {
    return this.lastBlock.header.blockHash;
  }

  createBlock(data: any): TBlock['payload'] {
    const newBlock: TBlock['payload'] = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(), // new Date().getTime()
      data,
      previousHash: this.getPreviousBlockHash(),
    };

    console.log(`Created block ${newBlock.sequence}: ${JSON.stringify(newBlock, null, 2)}`);

    return newBlock;
  }

  mineBlock(block: TBlock['payload']): TMinedBlock {
    let nonce: number = 0;
    // new Date().getTime()
    let startTime: number = +new Date();

    while (true) {
      const blockHash: string = hash(JSON.stringify(block));
      const proofingHash: string = hash(blockHash + nonce);

      let blockPow: THashProof = {
        hash: proofingHash,
        difficulty: this.difficulty,
        prefix: this.powPrefix,
      };

      if (isHashProofed(blockPow)) {
        const endTime: number = +new Date();
        const shortHash: string = blockHash.slice(0, 12);
        const mineTime: number = (endTime - startTime) / 1000;

        console.log(
          `Mined block ${block.sequence} in ${mineTime} seconds. Hash: ${shortHash} (${nonce} attempts)`,
        );

        return {
          minedBlock: { header: { nonce, blockHash }, payload: { ...block } },
          minedHash: proofingHash,
          shortHash,
          mineTime,
        };
      }
      nonce++;
    }
  }

  verifyBlock(block: TBlock): boolean {
    let blockPow: THashProof = {
      hash: hash(hash(JSON.stringify(block.payload)) + block.header.nonce),
      difficulty: this.difficulty,
      prefix: this.powPrefix,
    };

    if (block.payload.previousHash !== this.getPreviousBlockHash()) {
      console.error(
        `Invalid block #${block.payload.sequence}: Previous block hash is "${this.getPreviousBlockHash().slice(0, 12)}" not "${block.payload.previousHash.slice(0, 12)}"`,
      );
      return false;
    }

    if (!isHashProofed(blockPow)) {
      console.error(
        `Invalid block #${block.payload.sequence}: Hash is not proofed, nonce ${block.header.nonce} is not valid`,
      );
      return false;
    }

    return true;
  }

  pushBlock(block: TBlock): TBlock[] {
    if (this.verifyBlock(block)) this._chain.push(block);
    console.log(`Pushed block #${JSON.stringify(block, null, 2)}`);
    return this._chain;
  }
}
