import { makeApplicationCreateTxn, OnApplicationComplete, Transaction } from "algosdk";
import { user } from "./Config";
import { algodClient, compilePyTeal, compileTeal, submitTransaction } from "./Utils";

async function main() {
  let txn: Transaction;
  let txId: string;

  // compile PyTeal smart contracts
  const approval = await compileTeal(compilePyTeal('contracts/rekey_deposit'));
  const clear = await compileTeal(compilePyTeal('contracts/clear_program'));

  // get transaction params
  const params = await algodClient.getTransactionParams().do();

  // deploy app
  txn = makeApplicationCreateTxn(
    user.addr,
    params,
    OnApplicationComplete.NoOpOC,
    approval,
    clear,
    0,
    0,
    0,
    0
  );
  txId = await submitTransaction(txn, user.sk);
  const appId = (await algodClient.pendingTransactionInformation(txId).do())["application-index"];

  console.log("Deposit application id: " + appId);
}

main().catch(console.error);
