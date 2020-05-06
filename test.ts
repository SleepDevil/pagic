import Pagic from './src/Pagic';
import config from './pagic.config';

async function main() {
  const pagic = new Pagic();
  pagic.setConfig(config);
  await pagic.build();
  pagic.serve();
}

main();
