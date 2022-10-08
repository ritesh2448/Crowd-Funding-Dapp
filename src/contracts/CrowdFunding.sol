pragma solidity ^0.5.0;

contract CrowdFunding {
    uint256 public fundRaisersCount = 0;
    mapping(uint256 => FundRaiser) public fundRaisers;

    struct FundRaiser {
        uint256 id;
        string name;
        string description;
        uint256 minDonation;
        uint256 fundsToBeRaised;
        uint256 fundsRaised;
        address payable fundsAccepter;
        bool completed;
    }

    event FundRaiserCreated(
        uint256 id,
        string name,
        string description,
        uint256 minDonation,
        uint256 fundsToBeRaised,
        uint256 fundsRaised,
        address payable fundsAccepter,
        bool completed
    );

    event DonationRecieved(
        uint256 id,
        string name,
        uint256 fundsRaised,
        address payable fundsAccepter,
        bool completed
    );

    function createFundRaiser(
        string memory _name,
        string memory _description,
        uint256 _fundsToBeRaised,
        uint256 _minDonation
    ) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid description
        require(bytes(_description).length > 0);
        // Require a valid fundsToBeRaised
        require(_fundsToBeRaised > 0);
        // Require a valid minDonation
        require(_minDonation > 0);

        // Create the fund raiser
        fundRaisersCount++;
        fundRaisers[fundRaisersCount] = FundRaiser(
            fundRaisersCount,
            _name,
            _description,
            _minDonation,
            _fundsToBeRaised,
            0,
            msg.sender,
            false
        );

        emit FundRaiserCreated(
            fundRaisersCount,
            _name,
            _description,
            _minDonation,
            _fundsToBeRaised,
            0,
            msg.sender,
            false
        );
    }

    function donate(uint256 _id) public payable {
        FundRaiser memory _fundRaiser = fundRaisers[_id];
        // Fetch the owner
        address payable _acceptor = _fundRaiser.fundsAccepter;
        // Require a valid id
        require(_fundRaiser.id > 0 && _fundRaiser.id <= fundRaisersCount);
        // Require that value is greater than minDonation
        require(msg.value >= _fundRaiser.minDonation);
        // Require that the fund target has not been completed
        require(!_fundRaiser.completed);
        // Require that the owner is not donating
        require(_acceptor != msg.sender);

        // Add the value to the fundsRaised
        _fundRaiser.fundsRaised = _fundRaiser.fundsRaised + msg.value;

        if (_fundRaiser.fundsRaised >= _fundRaiser.fundsToBeRaised) {
            _fundRaiser.completed = true;
        }
        // Update the fundRaiser
        fundRaisers[_id] = _fundRaiser;
        // Donate the Ethers
        address(_acceptor).transfer(msg.value);

        // Trigger an event
        emit DonationRecieved(
            _id,
            _fundRaiser.name,
            _fundRaiser.fundsRaised,
            msg.sender,
            _fundRaiser.completed
        );
    }
}
