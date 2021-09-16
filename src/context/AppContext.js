import { Component, createContext } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ethers } from 'ethers';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions
});

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    account: '',
    chainID: '',
    provider: '',
    ethersProvider: '',
    web3: '',
    faqModalStatus: false
  };

  connectWallet = async () => {
    // web3Modal.clearCachedProvider();

    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const chainID = await web3.eth.net.getId();

    let ethersProvider = new ethers.providers.Web3Provider(
      web3.currentProvider
    );

    this.setState({
      account: accounts[0],
      chainID,
      web3,
      provider,
      ethersProvider
    });

    provider.on('accountsChanged', (accounts) => {
      this.setState({ account: accounts[0] });
    });

    provider.on('chainChanged', (chainId) => {
      ethersProvider = new ethers.providers.Web3Provider(web3.currentProvider);
      this.setState({ chainID: chainId, ethersProvider });
    });

    return this.state.account;
  };

  disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    this.setState(
      {
        account: '',
        chainID: '',
        web3: ''
      },
      () => (document.location.href = '/')
    );
  };

  updateFaqModalStatus = (status) => {
    this.setState({ faqModalStatus: status });
  };

  setTrackableAddress = (address) => {
    this.setState({ account: address });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          connectWallet: this.connectWallet,
          disconnectWallet: this.disconnectWallet,
          updateFaqModalStatus: this.updateFaqModalStatus,
          setTrackableAddress: this.setTrackableAddress
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
