// usado especificamente para gerar cheve mestra APP_KEY
// execute node tools/generate64bitkey.cjs, e copie a key para o .evc

const crypto = require('crypto');

function generateMasterKey() {
  const masterKey = crypto.randomBytes(32);

  return masterKey.toString('hex');
}

const key = generateMasterKey();
console.log(`Chave mestra gerada: ${key}`);
