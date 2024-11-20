import React from 'react'
import ReactDOM from 'react-dom/client'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const appName = 'Multi Call Test'
const projectId = import.meta.env.VITE_PROJECT_ID!
const infuraKey = import.meta.env.VITE_INFURA_KEY!

const config = getDefaultConfig({
	appName: appName,
	projectId: projectId,
	chains: [sepolia],
	ssr: true,
	transports: {
		[sepolia.id]: http('https://sepolia.infura.io/v3/' + infuraKey),
	},
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<App />
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>
)
