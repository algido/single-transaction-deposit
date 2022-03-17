import { encodeUint64, getApplicationAddress, makeApplicationNoOpTxn, Transaction } from "algosdk";
import { appId, user } from "./Config";
import { algodClient, submitTransaction } from "./Utils";

async function main() {
  let txn: Transaction;
  let txId: string;

  // get transaction params
  const params = await algodClient.getTransactionParams().do();

  // deposit
  const enc = new TextEncoder();
  const depositAmount = 1e6; // 1 ALGO

  txn = makeApplicationNoOpTxn(
    user.addr,
    { ...params, flatFee: true, fee: 2000 }, // must pay for inner transaction
    appId,
    [enc.encode("d"), encodeUint64(depositAmount)],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    getApplicationAddress(appId), // rekey to application address
  );
  txId = await submitTransaction(txn, user.sk);

  console.log("Deposit transaction id: " + txId);
}

main().catch(console.error);
