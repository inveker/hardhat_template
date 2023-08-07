import { deployments, ethers } from 'hardhat'
import { assert,expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Pricer, Pricer__factory } from '../typechain-types'

describe(`Pricer`, () => {
  let pricer: Pricer
  let initSnapshot: string
  let user: SignerWithAddress
  let owner: SignerWithAddress

  before(async () => {
    const accounts = await ethers.getSigners()
    user = accounts[1]

    await deployments.fixture()
    const PricerDeployment = await deployments.get('Pricer')

    pricer = Pricer__factory.connect(PricerDeployment.address, user)
    owner = await ethers.getImpersonatedSigner(await pricer.owner())

    initSnapshot = await ethers.provider.send('evm_snapshot', [])
  })

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [initSnapshot])
    initSnapshot = await ethers.provider.send('evm_snapshot', [])
  })

  it('Regular unit', async () => {
    const newPrice = ethers.utils.parseUnits('2', 8);
    const tx = await pricer.connect(owner).setCurrentPrice(newPrice)
    const receipt = await tx.wait()
    const {answer} = await pricer.latestRoundData()
    assert(answer.eq(newPrice), 'latestRoundData answer != newPrice')
  })

  it('Error unit', async () => {
    const newPrice = ethers.utils.parseUnits('2', 8);
    await expect(pricer.connect(user).setCurrentPrice(newPrice)).to.be.revertedWith('Ownable: caller is not the owner')
  })
})