
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from 'react-redux'
import {persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import Swal from 'sweetalert2'
import { signOut } from './redux/user/userSlice.jsx'

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  if (response.status === 403) {
    const clone = response.clone();
    try {
      const data = await clone.json();
      if (data.message === "Invalid refresh token. Please sign in again.") {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
          confirmButtonText: 'Log In'
        }).then(() => {
          store.dispatch(signOut());
          window.location.href = '/signin';
        });
      }
    } catch (e) {
      // Ignore if not json
    }
  }
  return response;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
    <App />
    </PersistGate>
  </Provider>,
)
