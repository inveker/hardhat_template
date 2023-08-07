import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre
  const { deploy } = deployments

  const signers = await ethers.getSigners()
  const deployer = signers[0]

  const ownerAddress = '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720'
  const initialPrice = ethers.utils.parseUnits('1', 8)

  await deploy('Pricer', {
    contract: 'Pricer',
    from: deployer.address,
    proxy: {
      proxyContract: 'UUPS',
      execute: {
        init: {
          methodName: 'initialize',
          args: [
            ownerAddress, // _owner
            initialPrice, // _initialPrice
          ],
        },
      },
    },
  })
}

deploy.tags = ['Pricer']
export default deploy
