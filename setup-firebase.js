const fs = require('fs');
const path = require('path');

// Pega o valor da variável que você criou no painel do Expo
const secretValue = process.env.GoogleServicePlist;
const destPath = path.join(__dirname, 'GoogleService-Info.plist');

if (secretValue) {
  // Cenário 1: O EAS baixou o arquivo e a variável contém o caminho temporário
  if (fs.existsSync(secretValue)) {
    fs.copyFileSync(secretValue, destPath);
    console.log(
      '✅ GoogleService-Info.plist copiado do EAS Secret File com sucesso!'
    );
  }
  // Cenário 2: A variável contém a string Base64
  else {
    fs.writeFileSync(destPath, Buffer.from(secretValue, 'base64'));
    console.log(
      '✅ GoogleService-Info.plist criado a partir da string Base64 com sucesso!'
    );
  }
} else {
  console.warn('⚠️ Variável GoogleServicePlist não encontrada no ambiente.');
}
