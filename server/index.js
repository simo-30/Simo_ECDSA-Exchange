const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

/*
generate addresses
*/
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const balances = {}

console.log('------ START SERVER ------');

for (let i=0; i<3; i++) {
	const key = ec.genKeyPair();
	const publicKey = key.getPublic().encode('hex');
	
	balances[publicKey] = 100*(i+1);
	
	console.log('Public key ' + publicKey + ' -> ' + balances[publicKey]);
	console.log('with private key ' + key.getPrivate().toString(16) + '\n');
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
