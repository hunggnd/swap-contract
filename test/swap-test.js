require('dotenv').config();
const TokenY = artifacts.require("TokenY");
const TokenZ = artifacts.require("TokenZ");
const Swap = artifacts.require("Swap");


const BN = web3.utils.BN;
const { assert } = require('chai');
const chai = require("chai");
const should = chai.should();

contract("Swap", (accounts) => {
  let swap;
  let tokenY;
  let tokenZ;
  let {admin , user} = accounts
  describe("before setup", () => {
    before(async function(){
      swap = await Swap.deployed();  
      tokenY = await TokenY.deployed();
      tokenZ = await TokenZ.deployed();
      await tokenY.transfer(accounts[1], new BN((100 * 10 ** 18).toString()));
      await tokenZ.transfer(accounts[1], new BN((100 * 10 ** 18).toString()));
      await tokenY.transfer(swap.address, new BN((100 * 10 ** 18).toString()));
      await tokenZ.transfer(swap.address, new BN((100 * 10 ** 18).toString()));
      //await web3.eth.sendTransaction({from: admin,to: swap.address,data: web3.eth.abi.encodeFunctionSignature("swap"),value:BN((10 * 10 ** 18).toString())});
     // await web3.eth.sendTransaction({from:admin, to:user, value: BN((5 * 10 ** 18).toString())});


    
      await swap.settingRate(tokenY.address, tokenZ.address, new BN((2 * 10**18).toString()));
      await swap.settingRate("0x0000000000000000000000000000000000000000", tokenZ.address, new BN((2 * 10**18).toString()));

    });

    it("initial state", async function () {
      const swapTokenYBalance = await tokenY.balanceOf(swap.address);
      const swapTokenZBalance = await tokenZ.balanceOf(swap.address);
      const userTokenYBalance = await tokenY.balanceOf(accounts[1]);
      const userTokenZBalance = await tokenZ.balanceOf(accounts[1]);

      assert.equal(swapTokenYBalance.toString(), (100*10**18).toString());
      assert.equal(swapTokenZBalance.toString(), (100*10**18).toString());
      assert.equal(userTokenYBalance.toString(), (100*10**18).toString());
      assert.equal(userTokenZBalance.toString(), (100*10**18).toString());

    });
    
    it("user swap 10tokenY -> 20tokenZ", async function () {
        const beforeSwapTokenYBalance = await tokenY.balanceOf(swap.address);
        const beforeSwapTokenZBalance = await tokenZ.balanceOf(swap.address);
        const beforeUserTokenYBalance = await tokenY.balanceOf(accounts[1]);
        const beforeUserTokenZBalance = await tokenZ.balanceOf(accounts[1]);
  
        await tokenY.approve(swap.address, new BN((10*10**18).toString()), {from: accounts[1]});
        await swap.swap(tokenY.address, tokenZ.address,new BN((10*10**18).toString()), {from: accounts[1]} );
        const afterSwapTokenYBalance = await tokenY.balanceOf(swap.address);
        const afterSwapTokenZBalance = await tokenZ.balanceOf(swap.address);
        const afterUserTokenYBalance = await tokenY.balanceOf(accounts[1]);
        const afterUserTokenZBalance = await tokenZ.balanceOf(accounts[1]);

         assert.equal(afterSwapTokenYBalance.toString(), beforeSwapTokenYBalance.add(new BN((10 * 10 ** 18).toString())).toString());
         assert.equal(afterSwapTokenZBalance.toString(), beforeSwapTokenZBalance.sub(new BN((20 * 10 ** 18).toString())).toString());
         assert.equal(afterUserTokenYBalance.toString(), beforeUserTokenYBalance.sub(new BN((10 * 10 ** 18).toString())).toString());
         assert.equal(afterUserTokenZBalance.toString(), beforeUserTokenZBalance.add(new BN((20 * 10 ** 18).toString())).toString());
  
      });

      it("user swap 10tokenZ -> 5tokenY", async function () {
        
  
        const beforeSwapTokenYBalance = await tokenY.balanceOf(swap.address);
        const beforeSwapTokenZBalance = await tokenZ.balanceOf(swap.address);
        const beforeUserTokenYBalance = await tokenY.balanceOf(accounts[1]);
        const beforeUserTokenZBalance = await tokenZ.balanceOf(accounts[1]);
  
        await tokenZ.approve(swap.address, new BN((10*10**18).toString()), {from: accounts[1]});
        await swap.swap(tokenZ.address, tokenY.address,new BN((10*10**18).toString()), {from: accounts[1]} );
        const afterSwapTokenYBalance = await tokenY.balanceOf(swap.address);
        const afterSwapTokenZBalance = await tokenZ.balanceOf(swap.address);
        const afterUserTokenYBalance = await tokenY.balanceOf(accounts[1]);
        const afterUserTokenZBalance = await tokenZ.balanceOf(accounts[1]);

         assert.equal(afterSwapTokenYBalance.toString(), beforeSwapTokenYBalance.sub(new BN((5 * 10 ** 18).toString())).toString());
         assert.equal(afterSwapTokenZBalance.toString(), beforeSwapTokenZBalance.add(new BN((10 * 10 ** 18).toString())).toString());
         assert.equal(afterUserTokenYBalance.toString(), beforeUserTokenYBalance.add(new BN((5 * 10 ** 18).toString())).toString());
         assert.equal(afterUserTokenZBalance.toString(), beforeUserTokenZBalance.sub(new BN((10 * 10 ** 18).toString())).toString());
  
      });


      it("user swap 1ETH -> 2tokenZ", async function () {
        
  
        const beforeSwapETHBalance = await web3.eth.getBalance(swap.address);
        const beforeSwapTokenZBalance = await tokenZ.balanceOf(swap.address);
        const beforeUserETHBalance = await web3.eth.getBalance(accounts[0]);
        const beforeUserTokenZBalance = await tokenZ.balanceOf(accounts[0]);
  
      //  await tokenZ.approve(swap.address, new BN((10*10**18).toString()), {from: accounts[1]});
        await swap.swap("0x0000000000000000000000000000000000000000",tokenZ.address,0, {from: accounts[0], value: 1 * 10 ** 18} );
        const afterSwapETHBalance = await web3.eth.getBalance(swap.address);
        const afterSwapTokenZBalance = await tokenZ.balanceOf(swap.address);
        const afterUserETHBalance = await web3.eth.getBalance(accounts[0]);
        const afterUserTokenZBalance = await tokenZ.balanceOf(accounts[0]);

        assert.equal(beforeSwapETHBalance, "0");
        assert.equal(afterSwapETHBalance.toString(), new BN((1 * 10 ** 18).toString()));

         assert.equal(afterSwapTokenZBalance.toString(), beforeSwapTokenZBalance.sub(new BN((2 * 10 ** 18).toString())).toString());
         assert.equal(afterUserTokenZBalance.toString(), beforeUserTokenZBalance.add(new BN((2 * 10 ** 18).toString())).toString());
  
      });
  })
})
  