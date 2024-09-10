import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <Provider store={store}>
      <App />
      {/* <LoginDemo/> */}
    </Provider>
  </ChakraProvider>
)
