const translate = require('@vitalets/google-translate-api');

async function translator(sent){
  // जरा 250 ग्राम वाला बिस्किट का पैकेट दिखाना
    const x = translate(sent, {from: 'hi', to: 'en'})
  .then((response) => response.text)
  .then((txt) => {
    return txt;
  });
  return x;
}

module.exports = {
    translator
  };