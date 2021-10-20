import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App'

import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider resetCSS={true}>
            <App />
          </ChakraProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
