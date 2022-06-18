from typing import Optional, List

from algosdk.v2client.algod import AlgodClient
from algosdk.kmd import KMDClient

from .account import Account
from random import choice, randint

from algosdk.future import transaction
from algosdk import account
from .util import PendingTxnResponse, waitForTransaction

ALGOD_ADDRESS = "http://localhost:4001"
ALGOD_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


def getAlgodClient() -> AlgodClient:
    return AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

KMD_ADDRESS = "http://localhost:4002"
KMD_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

KMD_WALLET_NAME = "unencrypted-default-wallet"
KMD_WALLET_PASSWORD = ""
FUNDING_AMOUNT = 100_000_000


def getKmdClient() -> KMDClient:
    return KMDClient(KMD_TOKEN, KMD_ADDRESS)

accountList: List[Account] = []
def getTemporaryAccount(client: AlgodClient) -> Account:
    global accountList

    if len(accountList) == 0:
        sks = [account.generate_account()[0] for i in range(16)]
        accountList = [Account(sk) for sk in sks]

        genesisAccounts = getGenesisAccounts()
        suggestedParams = client.suggested_params()

        txns: List[transaction.Transaction] = []
        for i, a in enumerate(accountList):
            fundingAccount = genesisAccounts[i % len(genesisAccounts)]
            txns.append(
                transaction.PaymentTxn(
                    sender=fundingAccount.getAddress(),
                    receiver=a.getAddress(),
                    amt=FUNDING_AMOUNT,
                    sp=suggestedParams,
                )
            )

        txns = transaction.assign_group_id(txns)
        signedTxns = [
            txn.sign(genesisAccounts[i % len(genesisAccounts)].getPrivateKey())
            for i, txn in enumerate(txns)
        ]

        client.send_transactions(signedTxns)

        waitForTransaction(client, signedTxns[0].get_txid())

    return accountList.pop()

kmdAccounts: Optional[List[Account]] = None

def getGenesisAccounts() -> List[Account]:
    global kmdAccounts

    if kmdAccounts is None:
        kmd = getKmdClient()

        wallets = kmd.list_wallets()
        walletID = None
        for wallet in wallets:
            if wallet["name"] == KMD_WALLET_NAME:
                walletID = wallet["id"]
                break

        if walletID is None:
            raise Exception("Wallet not found: {}".format(KMD_WALLET_NAME))

        walletHandle = kmd.init_wallet_handle(walletID, KMD_WALLET_PASSWORD)

        try:
            addresses = kmd.list_keys(walletHandle)
            privateKeys = [
                kmd.export_key(walletHandle, KMD_WALLET_PASSWORD, addr)
                for addr in addresses
            ]
            kmdAccounts = [Account(sk) for sk in privateKeys]
        finally:
            kmd.release_wallet_handle(walletHandle)

    return kmdAccounts

def createAsset(client: AlgodClient, url: None , total: int, account: Account = None , private_key = None,account_name = "Unknown") -> int:
    if account is None:
        print("if statement")
        account = getTemporaryAccount(client)
        private_key = account.getPrivateKey()
        account = account.getAddress()

    randomNumber = randint(0, 999)
    # this random note reduces the likelihood of this transaction looking like a duplicate
    randomNote = bytes(randint(0, 255) for _ in range(20))

    txn = transaction.AssetCreateTxn(
        sender= account,  #account.getAddress(),
        total=total,
        decimals=0,
        default_frozen=False,
        manager=account, #.getAddress(),
        reserve=account, #.getAddress(),
        freeze=account, #.getAddress(),
        clawback=account, #.getAddress(),
        unit_name= account_name, #f"D{randomNumber}",
        asset_name= "10 Academy Certificate", #f"Dummy {randomNumber}",
        url=url,
        note=randomNote,
        sp=client.suggested_params(),
    )
    signedTxn = txn.sign(private_key) #account.getPrivateKey())

    client.send_transaction(signedTxn)

    response = waitForTransaction(client, signedTxn.get_txid())
    assert response.assetIndex is not None and response.assetIndex > 0
    return response.assetIndex

def optInToAsset(
    client: AlgodClient, private_key:None , assetID: int, account: Account
) -> PendingTxnResponse:
    
    txn = transaction.AssetOptInTxn(
        sender=account, #.getAddress(),
        index=assetID,
        sp=client.suggested_params(),
    )
    signedTxn = txn.sign(private_key)

    client.send_transaction(signedTxn)
    return waitForTransaction(client, signedTxn.get_txid())
