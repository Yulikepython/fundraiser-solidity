const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {
    let fundraiser;
    const name = "Beneficiary Name";
    const url = "beneficiaryname.org";
    const imageURL = "https://placekitten.com/600/350";
    const description = "Beneficiary description";
    const beneficiary = accounts[1];
    const owner = accounts[0];

    describe("initialization", ()=>{
        beforeEach (async () => {
            fundraiser = await FundraiserContract.new(
                name,
                url,
                imageURL,
                description,
                beneficiary,
                owner
            )
        });
        it("gets the beneficiary name", async () => {
            const actual = await fundraiser.name();
            assert.equal(actual, name, "names should match");
        });
        it("gets the beneficiary url", async () => {
            const actual = await fundraiser.url();
            assert.equal(actual, url, "url should match");
        });
        it("gets the beneficiary image url", async () => {
            const actual = await fundraiser.imageURL();
            assert.equal(actual, imageURL, "imageURL should match");
        });
        it("gets the beneficiary description", async () => {
            const actual = await fundraiser.description();
            assert.equal(actual, description, "description should match");
        });
        it("gets the beneficiary", async () => {
            const actual = await fundraiser.beneficiary();
            assert.equal(actual, beneficiary, "beneficiary address should match");
        });
        it("gets the owner", async () => {
            const actual = await fundraiser.owner();
            assert.equal(actual, owner, "bios should match");
        });
    });

    describe("setBeneficiary", ()=>{
        const newBeneficiary = accounts[2];
        
        it("updated beneficiary when called by owner account", async ()=>{
            await fundraiser.setBeneficiary(newBeneficiary, {from: owner});
            const actualBeneficiary = await fundraiser.beneficiary();
            assert.equal(actualBeneficiary, newBeneficiary, "beneficiaries should match!");
        });
        it("throws an error when called from a non-owner account", async ()=>{
            try {
                await fundraiser.setBeneficiary(newBeneficiary, {from: accounts[3]});
                assert.fail("withdraw was not restricted to owners")
            } catch( err) {
                const expectedError = "Ownable: caller is not the owner"
                const actualError = err.reason;
                // console.log("actual error: ", actualError)
                // console.log("err: ", err)
                assert.equal(actualError, expectedError, "should not be permitted")
            }
        });
    });

    describe("making donations", ()=>{
        const value = web3.utils.toWei('0.02889');
        const donor = accounts[2];

        it("increases myDonationsCount", async () => {
            const currentDonationsCount = await fundraiser.myDonationsCount(
                {from: donor}
            );

            await fundraiser.donate({from: donor, value});

            const newDonationsCount = await fundraiser.myDonationsCount(
                {from: donor}
            );

            assert.equal(
                1,
                newDonationsCount - currentDonationsCount,
                "myDonationsCount should increment by 1"
            );
        });
        it("includes donation in myDonations", async ()=>{
            await fundraiser.donate({from: donor, value});
            const {values, dates} = await fundraiser.myDonations(
                {from: donor}
            );
            assert.equal(
                value,
                values[0],
                "values should match"
            );
        });
        it("increases the totalDopnations amount", async () => {
            const currentTotalDonations = await fundraiser.totalDonations();
            await fundraiser.donate({from: donor, value});
            const newTotalDonations = await fundraiser.totalDonations();

            const diff = newTotalDonations - currentTotalDonations;

            assert.equal(
                diff, 
                value,
                "difference should match the donation value"
            );
        });
        
        it("emits the DonationReceived event", async ()=>{
            const tx = await fundraiser.donate({from: donor,value});
            const expectedEvent = "DonationReceived";
            const actualEvent = tx.logs[0].event;

            assert.equal(actualEvent, exptectedEvent, "events should match");
        })
    });
});