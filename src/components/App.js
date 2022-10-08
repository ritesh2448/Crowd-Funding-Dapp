import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import CrowdFunding from '../abis/CrowdFunding.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async setAccountListener(provider)  {
    provider.on("accountsChanged",(accounts)=>{
      this.setState({ account: accounts[0] })
    })
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

 

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    // setAccountListener(web3.givenProvider);
    web3.givenProvider.on("accountsChanged",(accounts)=>{
      this.setState({ account: accounts[0] })
    })
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = CrowdFunding.networks[networkId]
    if (networkData) {
      const crowdFunding = web3.eth.Contract(CrowdFunding.abi, networkData.address)
      this.setState({ crowdFunding })
      const fundRaisersCount = await crowdFunding.methods.fundRaisersCount().call()
      this.setState({ fundRaisersCount })

      for (var i = 1; i <= fundRaisersCount; i++) {
        const fundRaiser = await crowdFunding.methods.fundRaisers(i).call()
        this.setState({
          fundRaisers: [...this.state.fundRaisers, fundRaiser]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Crowd Funding contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      fundRaisersCount: 0,
      fundRaisers: [],
      loading: true
    }

    this.createFundRaiser = this.createFundRaiser.bind(this)
    this.donate = this.donate.bind(this)
  }

  createFundRaiser(name, description, fundsToBeRaised, minDonation) {
    this.setState({ loading: true })
    this.state.crowdFunding.methods.createFundRaiser(name, description, fundsToBeRaised, minDonation).send({ from: this.state.account })
      .once('transactionHash', (receipt) => {
        this.setState({ loading: false })
      })
  }

  donate(id, price) {
    this.setState({ loading: true })
    this.state.crowdFunding.methods.donate(id).send({ from: this.state.account, value: price })
      .once('transactionHash', (receipt) => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid middle">
          <div>
            <main role="main">
              {this.state.loading
                ? <div id="loader" className="loader"><p className="text-center">Loading...</p></div>
                : <Main
                  fundRaisers={this.state.fundRaisers}
                  createFundRaiser={this.createFundRaiser}
                  donate={this.donate} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
