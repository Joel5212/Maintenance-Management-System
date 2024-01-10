import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import { useAuthContext } from './hooks/useAuthContext';

function App() {

  const { user } = useAuthContext()

  return (
    //if user is null show the login screen
    <div className="app">
      {!user && (
        <Login />
      )}
      {user && (
        <Home />
      )}
    </div>
  );
}
export default App;

