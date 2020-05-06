import Pagic from 'pagic';
import config from '../pagic.config';

test('adds 1 + 2 to equal 3', async () => {
  const pagic = new Pagic();
  pagic.setConfig(config);
  await pagic.build();
  pagic.serve();
  expect(await pagic.build()).toBe(3);
});
