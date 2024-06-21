import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { type Address } from 'viem'
import { contractAbi } from './contract'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function App() {
	const contractAddress: Address =
		'0x5131b315AABc299978991531ab1a7721488FfFb0'

	const { data: action1Hash, writeContract: action1 } = useWriteContract()

	const { isSuccess: isAction1Success } = useWaitForTransactionReceipt({
		hash: action1Hash,
	})

	function waitFor(seconds: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, seconds * 1000)
		})
	}

	const { writeContract: action2 } = useWriteContract()

	const handleClick = async () => {
		try {
			action1({
				address: contractAddress,
				abi: contractAbi,
				functionName: 'startDelay',
				args: [BigInt(10)],
			})
			console.log('isAction1Success is ', isAction1Success)

			if (isAction1Success) {
				console.log('Action1 Succeeded')
				await waitFor(10)
				action2({
					address: contractAddress,
					abi: contractAbi,
					functionName: 'doSomething',
				})
			}
		} catch (error) {
			console.log('An error occurred.')
			console.error(error)
		}
	}

	return (
		<>
			<div className="flex items-center">
				<ConnectButton accountStatus="address" showBalance={false} />
			</div>
			<div>
				<button
					onClick={handleClick}
					className="text-white rounded-full mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-all ease-in duration-100"
				>
					Perform 2 actions
				</button>
			</div>
		</>
	)
}

export default App
