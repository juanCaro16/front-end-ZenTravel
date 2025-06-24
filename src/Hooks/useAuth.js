// src/Hooks/useAuth.js
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("accessToken")
      const role = localStorage.getItem("Rol")

      if (token) {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp > currentTime) {
          setIsAuthenticated(true)
          setUserRole(role)
        } else {
          logout()
        }
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (token, refreshToken, role) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("Rol", role)
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("Rol")
    setIsAuthenticated(false)
    setUserRole(null)
  }

  const hasRole = (requiredRole) => userRole === requiredRole
  const hasAnyRole = (requiredRoles) => requiredRoles.includes(userRole)

  return {
    isAuthenticated,
    userRole,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    checkAuthStatus,
  }
}

export default useAuth
