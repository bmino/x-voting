const { ethers } = require("hardhat");
const chai = require("chai");
const { expect } = chai;
const { smoddit } = require('@eth-optimism/smock');


describe("Governance", function() {
  let xSNOB;
  let governance;
  let governanceABI;
  let validProposal;

  beforeEach(async () => {
    const owner = await ethers.getSigner();

    // Deploy sample xSNOB
    const xSNOBFactory = await smoddit('DummyXSNOB');
    xSNOB = await xSNOBFactory.deploy();
    await xSNOB.deployed();

    const Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy(xSNOB.address);
    await governance.deployed();
    governanceABI = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_xSNOB","internalType":"address"}]},{"type":"event","name":"ExecutionDelayChanged","inputs":[{"type":"uint256","name":"newExecutionDelay","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"MinimumVotingPeriodChanged","inputs":[{"type":"uint256","name":"newMinimumVotingPeriod","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"NewVote","inputs":[{"type":"uint256","name":"proposalId","internalType":"uint256","indexed":false},{"type":"address","name":"voter","internalType":"address","indexed":false},{"type":"bool","name":"support","internalType":"bool","indexed":false},{"type":"uint256","name":"votes","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ProposalCreated","inputs":[{"type":"uint256","name":"proposalId","internalType":"uint256","indexed":false},{"type":"address","name":"proposer","internalType":"address","indexed":false},{"type":"string","name":"title","internalType":"string","indexed":false}],"anonymous":false},{"type":"event","name":"ProposalExecuted","inputs":[{"type":"uint256","name":"proposalId","internalType":"uint256","indexed":false},{"type":"address","name":"executor","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"ProposalThresholdChanged","inputs":[{"type":"uint256","name":"newProposalThreshold","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"QuorumVotesChanges","inputs":[{"type":"uint256","name":"newQuorumVotes","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"EXECUTION_DELAY_MAXIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"EXECUTION_DELAY_MINIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"EXPIRATION_PERIOD","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"MAXIMUM_VOTING_PERIOD","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"MINIMUM_VOTING_PERIOD_MAXIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"MINIMUM_VOTING_PERIOD_MINIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"PROPOSAL_THRESHOLD_MAXIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"PROPOSAL_THRESHOLD_MINIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"QUORUM_VOTES_MAXIMUM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"QUORUM_VOTES_MINIMUM","inputs":[]},{"type":"function","stateMutability":"payable","outputs":[{"type":"bytes","name":"","internalType":"bytes"}],"name":"execute","inputs":[{"type":"uint256","name":"_proposalId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"executionDelay","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct Governance.Receipt","components":[{"type":"bool","name":"hasVoted","internalType":"bool"},{"type":"bool","name":"support","internalType":"bool"},{"type":"uint256","name":"votes","internalType":"uint256"}]}],"name":"getReceipt","inputs":[{"type":"uint256","name":"_proposalId","internalType":"uint256"},{"type":"address","name":"_voter","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"minimumVotingPeriod","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"proposalCount","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"proposalThreshold","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"id","internalType":"uint256"},{"type":"string","name":"title","internalType":"string"},{"type":"string","name":"metadata","internalType":"string"},{"type":"address","name":"proposer","internalType":"address"},{"type":"address","name":"executor","internalType":"address"},{"type":"uint256","name":"startTime","internalType":"uint256"},{"type":"uint256","name":"votingPeriod","internalType":"uint256"},{"type":"uint256","name":"forVotes","internalType":"uint256"},{"type":"uint256","name":"againstVotes","internalType":"uint256"},{"type":"address","name":"target","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"},{"type":"bytes","name":"data","internalType":"bytes"}],"name":"proposals","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"propose","inputs":[{"type":"string","name":"_title","internalType":"string"},{"type":"string","name":"_metadata","internalType":"string"},{"type":"uint256","name":"_votingPeriod","internalType":"uint256"},{"type":"address","name":"_target","internalType":"address"},{"type":"uint256","name":"_value","internalType":"uint256"},{"type":"bytes","name":"_data","internalType":"bytes"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"quorumVotes","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"hasVoted","internalType":"bool"},{"type":"bool","name":"support","internalType":"bool"},{"type":"uint256","name":"votes","internalType":"uint256"}],"name":"receipts","inputs":[{"type":"uint256","name":"","internalType":"uint256"},{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setExecutionDelay","inputs":[{"type":"uint256","name":"_seconds","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setMinimumVotingPeriod","inputs":[{"type":"uint256","name":"_seconds","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setProposalThreshold","inputs":[{"type":"uint256","name":"_votes","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setQuorumVotes","inputs":[{"type":"uint256","name":"_votes","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"enum Governance.ProposalState"}],"name":"state","inputs":[{"type":"uint256","name":"proposalId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"vote","inputs":[{"type":"uint256","name":"_proposalId","internalType":"uint256"},{"type":"bool","name":"_support","internalType":"bool"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IxSNOB"}],"name":"xSNOB","inputs":[]}];

    const amount_xSNOB = '1000000' + '0'.repeat(18);
    await xSNOB.smodify.put({
      _balances: {
        [owner.address]: amount_xSNOB
      }
    });
    expect(await xSNOB.balanceOf(owner.address)).to.equal(amount_xSNOB);

    validProposal = [
      "Sample Title",
      "/ipfs/metadata",
      await governance.minimumVotingPeriod(),
      ethers.constants.AddressZero,
      0,
      ethers.constants.HashZero,
    ];
  });

  it("Should return the same xSNOB address used at contract creation", async function() {
    expect(await governance.xSNOB()).to.equal(xSNOB.address);
  });

  it("Should have no proposals at contract creation", async function() {
    expect(await governance.proposalCount()).to.equal(0);
  });

  describe('Proposing', async function() {
    it("Cannot submit proposal with 0 xSNOB", async function() {
      const [owner, wallet1] = await ethers.getSigners();
      expect(await xSNOB.balanceOf(wallet1.address)).to.equal(0);

      await expect(governance.connect(wallet1).propose(
        ...validProposal
      )).to.be.revertedWith('Governance::propose: proposer votes below proposal threshold');
    });

    it("Cannot submit proposal with low voting period", async function() {
      const invalidProposal = [...validProposal];
      invalidProposal[2] = (await governance.minimumVotingPeriod()).sub(1);

      await expect(governance.propose(
        ...invalidProposal,
      )).to.be.revertedWith('Governance::propose: voting period too short');
    });

    it("Cannot submit proposal with high voting period", async function() {
      const invalidProposal = [...validProposal];
      invalidProposal[2] = (await governance.VOTING_PERIOD_MAXIMUM()).add(1);

      await expect(governance.propose(
        ...invalidProposal,
      )).to.be.revertedWith('Governance::propose: voting period too long');
    });

    it("Can submit proposal", async function() {
      const owner = await ethers.getSigner();

      await governance.propose(...validProposal);

      const proposal1 = await governance.proposals(1);
      expect(proposal1.proposer).to.equal(owner.address);
      expect(proposal1.forVotes).to.equal(0);
      expect(proposal1.againstVotes).to.equal(0);
      expect(proposal1.executor).to.equal(ethers.constants.AddressZero);
      expect(proposal1.title).to.equal(validProposal[0]);
      expect(proposal1.metadata).to.equal(validProposal[1]);
      expect(proposal1.votingPeriod).to.equal(validProposal[2]);

      const proposalExecutionContext1 = await governance.proposalExecutionContexts(1);

      expect(proposalExecutionContext1.target).to.equal(validProposal[3]);
      expect(proposalExecutionContext1.value).to.equal(validProposal[4]);
      expect(proposalExecutionContext1.data).to.equal(validProposal[5]);

      expect(await governance.proposalCount()).to.equal(1);
      expect(await governance.state(1)).to.equal(0); // Active
    });

    it("Cannot have two proposals when previous is active", async function() {
      await governance.propose(...validProposal);

      expect(await governance.state(1)).to.equal(0); // Active

      await expect(governance.propose(
        ...validProposal,
      )).to.be.revertedWith('Governance::propose: proposer already has a proposal in progress');
    });

    it("Cannot have two proposals when previous is pending execution", async function() {
      await governance.propose(...validProposal);

      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);

      const votingPeriodEnd = proposal1.startTime.add(proposal1.votingPeriod);

      await ethers.provider.send("evm_setNextBlockTimestamp", [votingPeriodEnd.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).to.equal(2); // Pending Execution

      await expect(governance.propose(
        ...validProposal,
      )).to.be.revertedWith('Governance::propose: proposer already has a proposal in progress');
    });

    it("Cannot have two proposals when previous is ready for execution", async function() {
      await governance.propose(...validProposal);

      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionDelay = await governance.executionDelay();

      const executionPeriodStarts = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);

      await ethers.provider.send("evm_setNextBlockTimestamp", [executionPeriodStarts.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).to.equal(3); // Ready for execution

      await expect(governance.propose(
        ...validProposal,
      )).to.be.revertedWith('Governance::propose: proposer already has a proposal in progress');
    });
  });

  describe('Voting', async function() {
    let xSNOB_balance;

    beforeEach(async function() {
      const owner = await ethers.getSigner();
      xSNOB_balance = await xSNOB.balanceOf(owner.address);

      await governance.propose(...validProposal);
    });

    it("Can vote yes", async function() {
      await governance.vote(1, true);
      expect((await governance.proposals(1)).forVotes).to.equal(xSNOB_balance);
      expect((await governance.proposals(1)).againstVotes).to.equal(0);
    });

    it("Can vote no", async function() {
      await governance.vote(1, false);
      expect((await governance.proposals(1)).forVotes).to.equal(0);
      expect((await governance.proposals(1)).againstVotes).to.equal(xSNOB_balance);
    });

    it("Can vote yes and change to no", async function() {
      await governance.vote(1, true);

      expect((await governance.proposals(1)).forVotes).to.equal(xSNOB_balance);
      expect((await governance.proposals(1)).againstVotes).to.equal(0);

      await governance.vote(1, false);

      expect((await governance.proposals(1)).forVotes).to.equal(0);
      expect((await governance.proposals(1)).againstVotes).to.equal(xSNOB_balance);
    });

    it("Can vote no and change to yes", async function() {
      await governance.vote(1, false);

      expect((await governance.proposals(1)).forVotes).to.equal(0);
      expect((await governance.proposals(1)).againstVotes).to.equal(xSNOB_balance);

      await governance.vote(1, true);

      expect((await governance.proposals(1)).forVotes).to.equal(xSNOB_balance);
      expect((await governance.proposals(1)).againstVotes).to.equal(0);
    });

    it('Cannot vote yes after voting period ends', async function() {
      const proposal1 = await governance.proposals(1);
      const votingEndTime = proposal1.startTime.add(proposal1.votingPeriod);

      await ethers.provider.send("evm_setNextBlockTimestamp", [votingEndTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).not.to.equal(0); // Not Active

      await expect(governance.vote(1, true)).to.be.revertedWith('Governance::vote: voting is closed');

      expect((await governance.proposals(1)).forVotes).to.equal(proposal1.forVotes);
      expect((await governance.proposals(1)).againstVotes).to.equal(proposal1.againstVotes);
    });

    it('Cannot vote no after voting period ends', async function() {
      const proposal1 = await governance.proposals(1);
      const votingEndTime = proposal1.startTime.add(proposal1.votingPeriod);

      await ethers.provider.send("evm_setNextBlockTimestamp", [votingEndTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).not.to.equal(0); // Not Active

      await expect(governance.vote(1, false)).to.be.revertedWith('Governance::vote: voting is closed');

      expect((await governance.proposals(1)).forVotes).to.equal(proposal1.forVotes);
      expect((await governance.proposals(1)).againstVotes).to.equal(proposal1.againstVotes);
    });
  });

  describe('Execution', async function() {
    let xSNOB_balance;

    beforeEach(async function () {
      const owner = await ethers.getSigner();
      xSNOB_balance = await xSNOB.balanceOf(owner.address);

      await governance.propose(...validProposal);
    });

    it('Cannot execute a proposal with 0 votes', async function() {
      const proposal1 = await governance.proposals(1);
      const executionDelay = await governance.executionDelay();

      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);

      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect((await governance.proposals(1)).forVotes).to.equal(0);
      expect((await governance.proposals(1)).againstVotes).to.equal(0);
      expect(await governance.state(1)).to.equal(1); // Defeated

      await expect(governance.execute(1)).to.be.revertedWith('Governance::execute: cannot be executed');

      expect((await governance.proposals(1)).executor).to.equal(ethers.constants.AddressZero);
    });

    it('Cannot execute a proposal proposal id of 0', async function() {
      await expect(governance.execute(0)).to.be.revertedWith('Governance::state: invalid proposal id');
    });

    it('Cannot execute a defeated proposal', async function() {
      const proposal1 = await governance.proposals(1);
      const executionDelay = await governance.executionDelay();

      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);

      await governance.vote(1, false);

      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).to.equal(1); // Defeated

      await expect(governance.execute(1)).to.be.revertedWith('Governance::execute: cannot be executed');

      expect((await governance.proposals(1)).executor).to.equal(ethers.constants.AddressZero);
    });

    it('Cannot execute a proposal pending execution', async function() {
      const proposal1 = await governance.proposals(1);

      const votingPeriodEnd = proposal1.startTime.add(proposal1.votingPeriod);

      await governance.vote(1, true);

      await ethers.provider.send("evm_setNextBlockTimestamp", [votingPeriodEnd.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).to.equal(2); // Pending Execution

      await expect(governance.execute(1)).to.be.revertedWith('Governance::execute: cannot be executed');

      expect((await governance.proposals(1)).executor).to.equal(ethers.constants.AddressZero);
    });

    it('Cannot execute an expired proposal', async function() {
      const proposal1 = await governance.proposals(1);
      const executionDelay = await governance.executionDelay();
      const expirationPeriod = await governance.EXPIRATION_PERIOD();

      const proposalExpired = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay).add(expirationPeriod);

      await governance.vote(1, true);

      await ethers.provider.send("evm_setNextBlockTimestamp", [proposalExpired.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).to.equal(5); // Pending Execution

      await expect(governance.execute(1)).to.be.revertedWith('Governance::execute: cannot be executed');

      expect((await governance.proposals(1)).executor).to.equal(ethers.constants.AddressZero);
    });

    it('Can execute a proposal', async function() {
      const owner = await ethers.getSigner();
      const proposal1 = await governance.proposals(1);
      const executionDelay = await governance.executionDelay();

      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);

      await governance.vote(1, true);

      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      expect(await governance.state(1)).to.equal(3); // Ready for Execution

      await governance.execute(1);

      expect(await governance.state(1)).to.equal(4); // Executed

      expect((await governance.proposals(1)).executor).to.equal(owner.address);
    });

    it('Cannot execute an already executed proposal', async function() {
      const proposal1 = await governance.proposals(1);
      const executionDelay = await governance.executionDelay();

      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);

      await governance.vote(1, true);

      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await governance.execute(1);

      expect(await governance.state(1)).to.equal(4); // Executed

      await expect(governance.execute(1)).to.be.revertedWith('Governance::execute: cannot be executed');
    });
  });

  describe('Parameters', async function() {
    let govInterface;
    let executionDelay;
    let parameterProposal;

    beforeEach(async function() {
      govInterface = new ethers.utils.Interface(governanceABI);
      executionDelay = await governance.executionDelay();
      parameterProposal = [...validProposal];
      parameterProposal[3] = governance.address;
    });

    it("Cannot set minimum voting period as an end user", async function() {
      const validValue = (await governance.minimumVotingPeriod()).add(1);
      await expect(governance.setMinimumVotingPeriod(validValue))
        .to.be.revertedWith('Governance: insufficient privileges');
    });

    it("Cannot set minimum voting period too low", async function() {
      const threshold = await governance.VOTING_PERIOD_MINIMUM();
      const newValue = threshold.sub(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setMinimumVotingPeriod(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Cannot set minimum voting period too high", async function() {
      const threshold = await governance.VOTING_PERIOD_MAXIMUM();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setMinimumVotingPeriod(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Can set minimum voting period", async function() {
      const threshold = await governance.minimumVotingPeriod();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setMinimumVotingPeriod(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).not.to.be.reverted;
      expect(await governance.minimumVotingPeriod()).to.equal(newValue);
    });

    it("Cannot set execution delay as an end user", async function() {
      const validValue = (await governance.EXECUTION_DELAY_MINIMUM()).add(1);
      await expect(governance.setExecutionDelay(validValue))
        .to.be.revertedWith('Governance: insufficient privileges');
    });

    it("Cannot set execution delay too low", async function() {
      const threshold = await governance.EXECUTION_DELAY_MINIMUM();
      const newValue = threshold.sub(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setExecutionDelay(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Cannot set execution delay too high", async function() {
      const threshold = await governance.EXECUTION_DELAY_MAXIMUM();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setExecutionDelay(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Can set execution delay", async function() {
      const threshold = await governance.EXECUTION_DELAY_MINIMUM();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setExecutionDelay(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).not.to.be.reverted;
      expect(await governance.executionDelay()).to.equal(newValue);
    });

    it("Cannot set quorum votes as an end user", async function() {
      const validValue = (await governance.QUORUM_VOTES_MINIMUM()).add(1);
      await expect(governance.setQuorumVotes(validValue))
        .to.be.revertedWith('Governance: insufficient privileges');
    });

    it("Cannot set quorum votes too low", async function() {
      const threshold = await governance.QUORUM_VOTES_MINIMUM();
      const newValue = threshold.sub(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setQuorumVotes(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Cannot set quorum votes too high", async function() {
      const threshold = await governance.QUORUM_VOTES_MAXIMUM();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setQuorumVotes(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Can set quorum votes", async function() {
      const threshold = await governance.quorumVotes();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setQuorumVotes(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).not.to.be.reverted;
      expect(await governance.quorumVotes()).to.equal(newValue);
    });

    it("Cannot set proposal threshold as an end user", async function() {
      const validValue = (await governance.PROPOSAL_THRESHOLD_MINIMUM()).add(1);
      await expect(governance.setProposalThreshold(validValue))
        .to.be.revertedWith('Governance: insufficient privileges');
    });

    it("Cannot set proposal threshold too low", async function() {
      const threshold = await governance.PROPOSAL_THRESHOLD_MINIMUM();
      const newValue = threshold.sub(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setProposalThreshold(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Cannot set proposal threshold too high", async function() {
      const threshold = await governance.PROPOSAL_THRESHOLD_MAXIMUM();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setProposalThreshold(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).to.be.reverted;
    });

    it("Can set proposal threshold", async function() {
      const threshold = await governance.proposalThreshold();
      const newValue = threshold.add(1);

      parameterProposal[5] = govInterface.encodeFunctionData('setProposalThreshold(uint256)', [newValue.toString()]);

      await governance.propose(...parameterProposal);
      await governance.vote(1, true);

      const proposal1 = await governance.proposals(1);
      const executionTime = proposal1.startTime.add(proposal1.votingPeriod).add(executionDelay);
      await ethers.provider.send("evm_setNextBlockTimestamp", [executionTime.add(1).toNumber()]);
      await ethers.provider.send("evm_mine");

      await expect(governance.execute(1)).not.to.be.reverted;
      expect(await governance.proposalThreshold()).to.equal(newValue);
    });
  });

});