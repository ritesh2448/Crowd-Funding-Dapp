import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content" className='center'>
        <h1 className='heading1' >Start Crowd Fund Raiser</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.fundRaiserName.value
          const description = this.fundRaiserDescription.value
          const fundsToBeRaised = window.web3.utils.toWei(this.fundRaiserFundsToBeRaised.value.toString(), 'Ether')
          const minDonation = window.web3.utils.toWei(this.minDonation.value.toString(), 'Ether')
          this.props.createFundRaiser(name, description, fundsToBeRaised, minDonation)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="fundRaiserName"
              type="text"
              ref={(input) => { this.fundRaiserName = input }}
              className="form-control"
              placeholder="Fund Raiser Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="fundRaiserDescription"
              type="text"
              ref={(input) => { this.fundRaiserDescription = input }}
              className="form-control"
              placeholder="Fund Raiser Description"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="fundRaiserFundsToBeRaised"
              type="text"
              ref={(input) => { this.fundRaiserFundsToBeRaised = input }}
              className="form-control"
              placeholder="Funds To Be Raised"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="minDonation"
              type="text"
              ref={(input) => { this.minDonation = input }}
              className="form-control"
              placeholder="Minimum Donation Amount"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Create Fund Raiser</button>
        </form>
        <p>&nbsp;</p>
        <h2 className='heading2'>Fund Raisers</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Funds Raised</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="fundRaiserList">
            {this.props.fundRaisers.map((fundRaiser, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{fundRaiser.id.toString()}</th>
                  <td>{fundRaiser.name}</td>
                  <td>{fundRaiser.description}</td>
                  <td>{window.web3.utils.fromWei(fundRaiser.fundsRaised.toString(), 'Ether')} Eth /
                    {window.web3.utils.fromWei(fundRaiser.fundsToBeRaised.toString(), 'Ether')} Eth</td>
                  <td>{fundRaiser.fundsAccepter}</td>
                  <td>
                    {!fundRaiser.completed
                      ?
                      <div>
                        <input
                          id={fundRaiser.id}
                          type="text"
                          ref={(input) => { this.donation = input }}
                          className="form-control"
                          placeholder="donate"
                          required />
                        <button
                          name={fundRaiser.id}
                          onClick={(event) => {
                            this.props.donate(event.target.name, window.web3.utils.toWei(document.getElementById(event.target.name).value.toString(), 'Ether'))
                          }}
                        >
                          Donate
                        </button>
                      </div>
                      : null
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
