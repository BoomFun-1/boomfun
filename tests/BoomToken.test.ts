import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('BoomToken', () => {
  let boomToken: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const BoomToken = await ethers.getContractFactory('BoomToken');
    boomToken = await BoomToken.deploy();
    await boomToken.deployed();
  });

  describe('部署', () => {
    it('应该设置正确的代币名称和符号', async () => {
      expect(await boomToken.name()).to.equal('BOOM');
      expect(await boomToken.symbol()).to.equal('BOOM');
    });

    it('应该将所有代币分配给部署者', async () => {
      const ownerBalance = await boomToken.balanceOf(owner.address);
      expect(await boomToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('交易', () => {
    it('应该能够转账代币', async () => {
      await boomToken.transfer(addr1.address, 50);
      expect(await boomToken.balanceOf(addr1.address)).to.equal(50);
    });

    it('应该在余额不足时失败', async () => {
      const initialBalance = await boomToken.balanceOf(addr1.address);
      await expect(
        boomToken.connect(addr1).transfer(addr2.address, 1)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
      expect(await boomToken.balanceOf(addr1.address)).to.equal(initialBalance);
    });
  });

  describe('暂停功能', () => {
    it('所有者应该能够暂停和恢复合约', async () => {
      await boomToken.pause();
      await expect(
        boomToken.transfer(addr1.address, 50)
      ).to.be.revertedWith('Token transfer while paused');
      
      await boomToken.unpause();
      await boomToken.transfer(addr1.address, 50);
      expect(await boomToken.balanceOf(addr1.address)).to.equal(50);
    });
  });

  describe('黑名单功能', () => {
    it('所有者应该能够将地址加入黑名单', async () => {
      await boomToken.blacklist(addr1.address);
      await expect(
        boomToken.transfer(addr1.address, 50)
      ).to.be.revertedWith('Blacklisted address');
    });

    it('所有者应该能够将地址从黑名单中移除', async () => {
      await boomToken.blacklist(addr1.address);
      await boomToken.removeFromBlacklist(addr1.address);
      await boomToken.transfer(addr1.address, 50);
      expect(await boomToken.balanceOf(addr1.address)).to.equal(50);
    });
  });

  describe('最大交易限额', () => {
    it('应该限制非所有者的最大交易金额', async () => {
      const maxAmount = ethers.utils.parseEther('1000');
      await boomToken.setMaxTransactionAmount(maxAmount);
      await boomToken.transfer(addr1.address, maxAmount.mul(2));

      await expect(
        boomToken.connect(addr1).transfer(addr2.address, maxAmount.add(1))
      ).to.be.revertedWith('Transfer amount exceeds limit');
    });
  });

  describe('销毁功能', () => {
    it('持有者应该能够销毁自己的代币', async () => {
      await boomToken.transfer(addr1.address, 100);
      await boomToken.connect(addr1).burn(50);
      expect(await boomToken.balanceOf(addr1.address)).to.equal(50);
    });

    it('授权用户应该能够销毁代币', async () => {
      await boomToken.transfer(addr1.address, 100);
      await boomToken.connect(addr1).approve(addr2.address, 50);
      await boomToken.connect(addr2).burnFrom(addr1.address, 50);
      expect(await boomToken.balanceOf(addr1.address)).to.equal(50);
    });
  });
});