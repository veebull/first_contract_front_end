import { useEffect, useState } from 'react';
import { MainContract } from '../contracts/MainContract';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract, toNano } from '@ton/core';
import { useTonConnect } from './useTonConnect';

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  // ! was missing
  const [balance, setBalance] = useState<string | bigint | number>(0);

  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const parsedAddress = Address.parse(
      'EQBOOyLEb-WKKsipMBi_eGkUHYnJXmqtLvntcfoQF1X5pPd1'
    );
    console.log(
      'file: useMainContract.ts:22 ~ mainContract ~ parsedAddress:',
      parsedAddress.toString()
    );

    const contract = new MainContract(parsedAddress);
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const contractData = await mainContract.getData();
      const contractBalance = await mainContract.getBalance();
      setContractData({
        counter_value: contractData.number,
        recent_sender: contractData.recent_sender,
        owner_address: contractData.owner_address,
      });

      setBalance(contractBalance.number);
      await sleep(10000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 5);
    },
    sendDeposit: () => {
      return mainContract?.sendDeposit(sender, toNano(1));
    },
    sendWithdrawalRequest: () => {
      return mainContract?.sendWithdrawalRequest(
        sender,
        toNano(0.05),
        toNano(0.7)
      );
    },
    ...contractData,
  };
}
