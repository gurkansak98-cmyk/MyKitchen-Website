import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  // localStorage'da token var mı kontrol et
  const token = localStorage.getItem('token')

  // Token yoksa → giriş sayfasına yönlendir
  if (!token) {
    // Navigate to login if token is missing
    return <Navigate to="/login" />
  }

  // Token varsa → çocuk bileşeni göster (sayfa içeriği)
  // Return the children if authenticated
  return children
}

export default ProtectedRoute
