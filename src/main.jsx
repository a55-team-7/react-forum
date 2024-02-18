
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
    100: '#000033', //dark blue
    200: '#4DFFFA', //light blue
    300: '#FF4500', //orange red
  },
}

const fonts = {
  heading: "Roboto, sans-serif",
  body: "Roboto, sans-serif",
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
