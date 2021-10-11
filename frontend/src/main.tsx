import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App'

import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider resetCSS={true}>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById('root')
)
