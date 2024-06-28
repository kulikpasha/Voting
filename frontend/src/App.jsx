import Header from './components/Header/Header'
import AppRouter from './components/AppRouter'
import { BrowserRouter } from 'react-router-dom';


export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <AppRouter />
      </BrowserRouter>
    </>
  )
}

