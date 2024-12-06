import { BinaryLike, createHash } from 'node:crypto';
import { THashProof } from './typing';

function hash(data: BinaryLike): string {
  return createHash('sha256').update(data).digest('hex');
}

function isHashProofed({ hash, difficulty = 4, prefix = '0' }: THashProof): boolean {
  const check = prefix.repeat(difficulty);
  return hash.startsWith(check);
}

export { hash, isHashProofed };

// https://www.youtube.com/watch?v=ztQEaQ06GYs tutorial
