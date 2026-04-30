import './App.css'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminRoute from './components/AdminRoute';
import AdminRegister from './pages/AdminRegister';
import Home from './components/Home';
import CategoryPage from './pages/CategoryPage';

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={< Home/>}/>
        <Route path="admin-login" element={< AdminLogin/>} />
        <Route path='/category/:categoryId' element={< CategoryPage/>}/>

          <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/"
          element={
            <div style={{ padding: "40px" }}>
              <h1>Limpopo Karakol</h1>
            </div>
          }
        />

        <Route path="/admin-register" element={<AdminRegister />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
