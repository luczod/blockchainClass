import { Blockchain } from './blockchain';

const blockchain = new Blockchain(Number(process.argv[2] || 4));
const blockNumber = +process.argv[3] || 10;
let chain = blockchain.chain;

for (let i = 1; i <= blockNumber; i++) {
  const block = blockchain.createBlock(`Block ${i}`);
  const mineInfo = blockchain.mineBlock(block);
  chain = blockchain.pushBlock(mineInfo.minedBlock);
}

console.log('--- GENERATED CHAIN ---\n');
console.log(chain);
// console.log(process.argv);

/* 
 node dist/index.js "4" "200"
 process.argv[0] = "the path to the Node.js interpreter"
 process.argv[1] = "the path to the file being executed"
 process.argv[2] = "4"
 process.argv[3] = "200"
*/
