from pyteal import *


def approval_program():
    return Int(1)


if __name__ == "__main__":
    print(compileTeal(approval_program(), Mode.Application, version=5))
