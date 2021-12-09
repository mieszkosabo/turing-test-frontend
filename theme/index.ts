import { extendTheme } from '@chakra-ui/react'

const colors = {
  white: '#F2F2F2',
  black: '#1F060D',
  brand: '#078C8C',
  gray: '#5A4E52'
};

export const theme = extendTheme({
  colors,
  styles: {
    global: {
      'html, body': {
        fontFamily: "'Fira Code', monospace",
        bg: 'white',
        color: 'black'
      }
    }
  }
})
