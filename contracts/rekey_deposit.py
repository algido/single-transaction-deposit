from pyteal import *


def approval_program():

    on_creation = Int(1)

    deposit_amount = Btoi(Txn.application_args[1])

    on_deposit = Seq(
        Assert(Global.group_size() == Int(1)),
        Assert(Txn.close_remainder_to() == Global.zero_address()),
        Assert(Txn.fee() == Int(2000)),
        Assert(Txn.application_args.length() == Int(2)),
        # verify sender has rekeyed to application address
        Assert(Txn.rekey_to() == Global.current_application_address()),
        # inner txn to deposit
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.sender: Txn.sender(),
            TxnField.receiver: Global.current_application_address(),
            TxnField.amount: deposit_amount,
            TxnField.fee: Int(0),
            TxnField.rekey_to: Txn.sender(),  # rekey back to user
        }),
        InnerTxnBuilder.Submit(),
        Int(1)
    )

    return Cond(
        [
            Txn.on_completion() == OnComplete.NoOp,
            Cond(
                [Txn.application_id() == Int(0), on_creation],
                [Txn.application_args[0] == Bytes("d"), on_deposit],
            )
        ],
    )


if __name__ == "__main__":
    print(compileTeal(approval_program(), Mode.Application, version=6))
