import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from './hooks/useMainContract';
import { useTonConnect } from './hooks/useTonConnect';
import { fromNano } from '@ton/core';
import WebApp from '@twa-dev/sdk';

function App() {
  const {
    contract_address,
    counter_value,
    // recent_sender,
    // owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();
  const { connected } = useTonConnect();
  const showAlert = () => {
    WebApp.showAlert('Hey there!');
  };
  const sendAppData = () => {
    WebApp.sendData('Super Web App Data!');
  };
  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <p>{WebApp.platform}</p>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address}</div>
          <b>Our contract Balance</b>
          {connected && (
            <div className='Hint'>{fromNano(contract_balance)}</div>
          )}
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? 'Loading...'}</div>
        </div>
      </div>
      <a
        onClick={() => {
          sendAppData();
        }}
      >
        Send App Data
      </a>
      <br />
      <a
        onClick={() => {
          showAlert();
        }}
      >
        Show Alert
      </a>
      <br />
      {connected && (
        <>
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment by 5
          </a>
          <br />
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            Request deposit of 1 TON
          </a>
          <br />
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            Request 0.7 TON withdrawal
          </a>
        </>
      )}
    </div>
  );
}

export default App;
