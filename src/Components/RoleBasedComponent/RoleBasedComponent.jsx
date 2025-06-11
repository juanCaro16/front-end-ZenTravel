export const RoleBasedComponent = ({ allowedRoles = [], children, fallback = null, requireAuth = true }) => {
  const token = localStorage.getItem("accessToken")
  const userRole = localStorage.getItem("Rol")

  // Si requiere autenticación y no hay token
  if (requireAuth && !token) {
    return fallback
  }

  // Si no se especifican roles, mostrar para cualquier usuario autenticado
  if (allowedRoles.length === 0) {
    return children
  }

  // Si el usuario tiene el rol requerido
  if (userRole && allowedRoles.includes(userRole)) {
    return children
  }

  // Si no tiene permisos, mostrar fallback
  return fallback
}
