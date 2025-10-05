// src/theme.ts
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#242329",
    },
    secondary: {
      main: "#e72544",
    },
    background: {
      default: "#242329",
      //paper: "#212b36",
      paper: "#2c2c2c"
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
    grey: {
      500: "#9e9e9e", // default gray
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e72544", // keep same on hover
          },
        },
      },
    },
    }
});

export default darkTheme;
