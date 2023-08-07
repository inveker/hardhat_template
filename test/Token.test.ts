import { deployments, ethers } from 'hardhat'
import { assert, expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Token, Token__factory, UUPSUpgradeable__factory } from '../typechain-types'
import { getImplementationAddress } from '@openzeppelin/upgrades-core'
const INITIAL_DATA = {
  totalSupply: ethers.utils.parseUnits('100000000', 18),
}

describe(`Token`, () => {
  let initSnapshot: string
  let deployer: SignerWithAddress
  let user: SignerWithAddress
  let owner: SignerWithAddress
  let token: Token

  before(async () => {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    user = accounts[1]

    await deployments.fixture()
    const TokenDeployment = await deployments.get('Token')

    token = Token__factory.connect(TokenDeployment.address, deployer)
    const ownerAddress = await token.owner()
    owner = await ethers.getImpersonatedSigner(ownerAddress)

    await deployer.sendTransaction({
      to: owner.address,
      value: ethers.utils.parseEther('10'),
    })

    initSnapshot = await ethers.provider.send('evm_snapshot', [])
  })

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [initSnapshot])
    initSnapshot = await ethers.provider.send('evm_snapshot', [])
  })

  it('Regular unit: Initial data test', async () => {
    const totalSupply = await token.totalSupply()
    assert(
      totalSupply.eq(INITIAL_DATA.totalSupply),
      `totalSupply != INITIAL_DATA.totalSupply. ${totalSupply} != ${INITIAL_DATA.totalSupply}`,
    )
  })

  it('Regular unit: Upgarde only deployer', async () => {
    const eltcFactory = await ethers.getContractFactory('Token')
    const newToken = await eltcFactory.deploy()
    const newImplementationAddress = newToken.address
    await token.connect(owner).upgradeTo(newImplementationAddress)
    const implementationAddress = await getImplementationAddress(ethers.provider, token.address)
    assert(
      newImplementationAddress == implementationAddress,
      `newImplementationAddress != implementationAddress. ${newImplementationAddress} != ${implementationAddress}`,
    )
  })

  it('Error unit: Upgarde not owner', async () => {
    const newImplementationAddress = ethers.constants.AddressZero
    await expect(token.connect(user).upgradeTo(newImplementationAddress)).to.be.revertedWith(
      'Ownable: caller is not the owner',
    )
  })

  
  it('Error unit: ownerSHip not owner', async () => {
    await expect(token.connect(user).transferOwnership(user.address)).to.be.revertedWith(
      'Ownable: caller is not the owner',
    )
  })
})
