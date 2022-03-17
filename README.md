# single-transaction-deposit
The repository shows an example where you can deposit ALGOs to a smart contract using a single transaction. It does so by:
1. Rekeying the sender account to the application address.
2. Sending an inner transaction from the sender account to the application account.
3. Rekeying the sender account back to its original address.

## Setup
To install all required packages, run:
```
python3 -m pip install -r requirements.txt
```
```
npm install
```

## Running examples
The file `examples/Config.ts` contains the configuration for the examples. Modify the file to include your chosen account and application id. 

To create the application, run the following command and make a note of the printed application id:
```
npm run deploy-app
```

To deposit, run the following command:
```
npm run rekey-deposit
```