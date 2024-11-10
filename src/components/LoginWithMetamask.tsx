import React, { useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}

const MetaMaskIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
  >
    <path d="M21.8195 2L13.2195 8.2L14.9195 4.4L21.8195 2Z" fill="#E17726" />
    <path d="M2.17945 2L10.6795 8.2L9.07945 4.4L2.17945 2Z" fill="#E27625" />
    <path
      d="M18.8195 16.8L16.5195 20.4L21.4195 21.8L22.8195 16.8H18.8195Z"
      fill="#E27625"
    />
    <path
      d="M1.17945 16.8L2.57945 21.8L7.47945 20.4L5.17945 16.8H1.17945Z"
      fill="#E27625"
    />
    <path
      d="M7.27945 10.6L5.87945 12.6L10.6795 12.8L10.4795 7.6L7.27945 10.6Z"
      fill="#E27625"
    />
    <path
      d="M16.7195 10.6L13.4195 7.6L13.3195 12.8L18.1195 12.6L16.7195 10.6Z"
      fill="#E27625"
    />
    <path
      d="M7.47945 20.4L10.2795 19L7.87945 16.8L7.47945 20.4Z"
      fill="#E27625"
    />
    <path
      d="M13.7195 19L16.5195 20.4L16.1195 16.8L13.7195 19Z"
      fill="#E27625"
    />
  </svg>
);

interface LoginAreaButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const LoginAreaButton: React.FC<LoginAreaButtonProps> = ({
  children,
  onClick,
  className = '',
}) => (
  <div
    onClick={onClick}
    className={`p-3 border-2 text-xl rounded-full cursor-pointer bg-white bg-opacity-50 hover:bg-gray-100 ${className}`}
  >
    {children}
  </div>
);

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
      {content}
    </div>
  </div>
);

const LoginAreaWithMetaMask = () => {
  const [error, setError] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');

  const truncateAddress = (address: string) => {
    if (!address) return '';
    const start = address.slice(0, 4);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        setError('No accounts found!');
        return;
      }

      setConnectedAddress(accounts[0]);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to connect to MetaMask');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 items-center">
        <span className="mr-3 font-semibold opacity-70 text-lg">
          {connectedAddress ? 'Connected:' : 'Sign in Metamask :'}
        </span>

        {connectedAddress ? (
          <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-800">
            {truncateAddress(connectedAddress)}
          </div>
        ) : (
          <Tooltip content="MetaMask">
            <LoginAreaButton
              onClick={connectMetaMask}
              className="w-12 h-12 flex items-center justify-center"
            >
              <MetaMaskIcon />
            </LoginAreaButton>
          </Tooltip>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default LoginAreaWithMetaMask;
