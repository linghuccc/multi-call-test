import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

import { useState } from 'react'
import { contractAbi, contractAddress } from './constants'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function App() {
	const [status, setStatus] = useState('')

	const {
		data,
		error: writeError,
		isPending,
		writeContractAsync,
	} = useWriteContract()

	const {
		error: txError,
		isLoading,
		isSuccess,
	} = useWaitForTransactionReceipt({
		hash: data,
	})

	// 假设 action1 和 action2 返回 Promise
	async function action1() {
		try {
			// 执行一些异步操作
			const action1Tx = await writeContractAsync({
				abi: contractAbi,
				address: contractAddress,
				functionName: 'startDelay',
				args: [BigInt(10)],
			})

			console.log('Action 1 hash:', action1Tx)

			return Promise.resolve('Action 1 completed')
		} catch (error) {
			console.log('Write error:', writeError)
			console.log('Transaction error:', txError)
			console.error('An error occurred:', error)

			return Promise.resolve('Action 1 error')
		}
	}

	function waitFor(seconds: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, seconds * 1000)
		})
	}

	async function action2() {
		try {
			await waitFor(10)

			// 执行一些异步操作
			const action2Tx = await writeContractAsync({
				abi: contractAbi,
				address: contractAddress,
				functionName: 'doSomething',
			})

			console.log('Action 2 hash:', action2Tx)

			return Promise.resolve('Action 2 completed')
		} catch (error) {
			console.log('Write error:', writeError)
			console.log('Transaction error:', txError)
			console.error('An error occurred:', error)

			return Promise.resolve('Action 2 error')
		}
	}
	async function handleClick() {
		try {
			// 等待 action1 完成
			const res1 = await action1()
			setStatus(res1) // 更新状态

			// 等待 action2 完成
			const res2 = await action2()
			setStatus(res2) // 更新状态
		} catch (error) {
			// 处理任何可能发生的错误
			console.error('An error occurred:', error)
		}
	}

	return (
		<div className="centered">
			<ConnectButton accountStatus="address" showBalance={false} />
			<div className="spacer" />
			<button disabled={isPending || isLoading} onClick={handleClick}>
				{isPending ? 'Pending' : isLoading ? 'Waiting' : 'Run Actions'}
			</button>
			<div className="spacer" />
			<p>Current status: {status}</p>
		</div>
	)
}

export default App
