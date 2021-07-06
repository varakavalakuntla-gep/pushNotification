import logo from './logo.svg';
import './App.css';
import Notification from './components/Notification';
import { React, useState } from 'react';
import { createPluginStore, PluginProvider, RendererPlugin } from "react-pluggable";
import ShowAlertPlugin from "./components/ShowAlertPlugin.tsx";
import Header from "./components/Header.tsx";
import Chat from './components/Chat';
import { blue, orange } from '@material-ui/core/colors';
import { ThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core'

export const defaultPrimary = blue[500];
export const defaultSecondary = orange[500];



const pluginStore = createPluginStore();
pluginStore.install(new RendererPlugin());
pluginStore.install(new ShowAlertPlugin());

function App() {
  const [isDisplay, setDisplay] = useState(false);
  var changeState = function () {
    setDisplay(!isDisplay);
  }

  const currentTheme = createMuiTheme({
    typography: {
      fontFamily: [
        'Nunito',
        'Montserrat',
        'Roboto',
        'sans-serif',
        'Arial',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },

    palette: {
      primary: {
        main: defaultPrimary,
      },
      secondary: {
        main: defaultSecondary,
      },

    },
  })
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div className="App">
        <Chat />
      </div>
    </ThemeProvider>
  );
}

export default App;
