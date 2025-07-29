const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture }  = require("@nomicfoundation/hardhat-network-helpers")

describe("FundraiserFactory", function () {
  let FundraiserFactory, fundraiserFactory;
  let Fundraiser;
  let owner, beneficiary;

//  beforeEach(async () => {
  async function runEveryTime() {  
    [owner, beneficiary] = await ethers.getSigners();
    // Deploy FundraiserFactory
    const FundraiserFactoryFactory = await ethers.getContractFactory("FundraiserFactory");
    fundraiserFactory = await FundraiserFactoryFactory.deploy();
    await fundraiserFactory.waitForDeployment();
    return { fundraiserFactory }

  };
  async function addFundraisers(factory, count) {
    const name = "Beneficiary";
    const lowerCaseName = name.toLowerCase();
    [owner, beneficiary] = await ethers.getSigners();

    for (let i=0; i < count; i++) {
      await factory.createFundraiser(
        `${name} ${i}`,
        `${lowerCaseName}${i}.com`,
        `${lowerCaseName}${i}.png`,
        `Description for ${name} ${i}`,
        beneficiary
      );
    }
  }
  describe("test zero fundraiser", () => {
	it("should start with zero fundraisers", async () => {
      const fundraiserf  = await ethers.deployContract("FundraiserFactory");
      const { fundraiserFactory }  = await loadFixture(runEveryTime);
      expect(fundraiserFactory , "contract has been deployed");
      expect(await fundraiserFactory.fundraisersCount()).to.equal(0);
  });
 });
  describe("when fundraisers collection is empty", () => {
    it("returns an empty collection", async () => {
  
        const { fundraiserFactory }  = await loadFixture(runEveryTime);
        const fundraiserCount = 0; 
        await addFundraisers(   fundraiserFactory, fundraiserCount);
	const fundraisers = await fundraiserFactory.fundraisers(10, 0);
        expect(await fundraiserFactory.fundraisersCount()).to.equal(0);
    });
  });
 
  describe("when fundraisers collection is empty", () => {
    it("results should be  10", async () => {
      const { fundraiserFactory }  = await loadFixture(runEveryTime);
      const fundraiserCount = 30;
      await addFundraisers(   fundraiserFactory, fundraiserCount);
      const fundraisers = await fundraiserFactory.fundraisers(10, 0);
      expect(await fundraisers.length).to.equal(10);
    });
  });

  describe("test for a single fundraiser name", () => {
    it("test a separate fundraiser name", async () => {
      //      const factory = await createFundraiserFactory(0, accounts);
      const { fundraiserFactory }  = await loadFixture(runEveryTime);
      const fundraiserCount = 30;
      await addFundraisers(   fundraiserFactory, fundraiserCount);
      const fundraisers = await fundraiserFactory.fundraisers(1, 0);
      expect(await fundraisers.length).to.equal(1);
      const fundraiserAddr = await fundraiserFactory.getFundraiserAt(0);  
      //  const fundraiser = await fundraisers.getFundraiserAt(0);
      const Fundraiser = await ethers.getContractFactory("Fundraiser");
      const fundraiser = Fundraiser.attach(fundraiserAddr);
      console.log(await fundraiser.name())
      expect(await fundraiser.name()).to.equal("Beneficiary 0");
      const name = await fundraiser.name();
      expect(await name.includes(0));
 });
 });
  
  describe("test offset  ", () => {
	  

  it("test the appropriate offset", async () => {
     const { fundraiserFactory }  = await loadFixture(runEveryTime);
     const fundraiserCount = 30;
     await addFundraisers(   fundraiserFactory, fundraiserCount);
     const fundraiserAddr = await fundraiserFactory.getFundraiserAt(7);
     const Fundraiser = await ethers.getContractFactory("Fundraiser");
     const fundraiser = Fundraiser.attach(fundraiserAddr);
     console.log(await fundraiser.name())
     expect(await fundraiser.name()).to.equal("Beneficiary 7");
     //test offset == fundraiserCount (should revert)
     //await expect(fundraiserFactory.fundraisers(1, fundraiserCount)).to.be.revertedWith(
     //"offset out of bounds "
     //);
     // test offset > fundraiserCount (should also revert)
     await expect(fundraiserFactory.fundraisers(1, fundraiserCount+10)).to.be.revertedWith(
     "offset out of bounds"
     );

  });
  });
});
