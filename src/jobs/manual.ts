import { processData } from './esiProcess';

(async function() {
  await processData();
  process.exit(0);
})();
