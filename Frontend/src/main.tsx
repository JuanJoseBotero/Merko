import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Catalog from './pages/Catalog'
import App from './App'
import { Link } from 'react-router-dom' 

const router = createBrowserRouter([
  { // Ruta en la que va a estar la estructura principal como la navbar
    path: '/',
    element: <App/>,
    children: [
      { // Pagina principal
        path: '/',
        element: <HomePage/>
      },
      { // Pagina del catalogo de analisis
        path: '/catalog',
        element: <Catalog/> 
      },
    ],
    ErrorBoundary: () => {
      return (
        <div className='flex flex-col items-center justify-center h-screen space-y-8'>
          <h1 className='text-4xl font-bold'>Error 404: page not found</h1>
          <Link to="/" className='main-button'>Go to Home</Link>
        </div>
      );
    },
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
