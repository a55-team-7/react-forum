
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'


// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    100: 'rgb(1, 2, 20)', //dark blue
    200: 'rgb(255, 0, 54)', //light blue
    300: 'rgb(255, 25, 52)', //orange red
  },
}

const fonts = {
  heading: "Inter",
  body: "Inter",
}

export const theme = extendTheme({ colors, fonts })

// 3. Pass the `theme` prop to the `ChakraProvider`

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
