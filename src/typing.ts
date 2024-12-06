type THashProof = {
  hash: string;
  difficulty?: number;
  prefix?: string;
};

type TMinedBlock = {
  minedBlock: TBlock;
  minedHash: string;
  shortHash: string;
  mineTime: number;
};

type TBlock = {
  header: {
    nonce: number;
    blockHash: string;
  };

  payload: {
    sequence: number;
    timestamp: number;
    data: any;
    previousHash: string;
  };
};

export { TBlock, TMinedBlock, THashProof };
