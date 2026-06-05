import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from './app/store';
import AppRoutes from "./router/AppRoutes";
import { StrictMode } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="bottom-right" reverseOrder={false} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

export default App;

