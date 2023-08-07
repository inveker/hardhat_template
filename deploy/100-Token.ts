import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre
  const { deploy } = deployments

  const signers = await ethers.getSigners()
  const deployer = signers[0]

  await deploy('Token', {
    contract: 'Token',
    from: deployer.address,
    proxy: {
      proxyContract: 'UUPS',
      execute: {
        init: {
          methodName: 'initialize',
          args: [
            'Token', // _name
            'TKN', // _symbol
            '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720', // _owner
            ethers.utils.parseUnits('100000000', 18), // _initialSupply
          ],
        },
      },
    },
  })
}

deploy.tags = ['Token']
export default deploy
