import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from "../../Services/AxiosInstance/AxiosInstance"


const TokenRefresher = () => {
    const location = useLocation();
        
    useEffect(() => {
        // ✅ Ignorar refresh si estamos en la página raíz ('/')
        if (location.pathname === '/') {
            console.log("🚫 Ruta inicial detectada (/), no se refresca el token.");
            return;
        }

        const refreshIfNeeded = async () => {
            const token = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!token || !refreshToken) return;
            
            console.log('📍 Cambio de ruta detectado:', location.pathname);
            
            if (isTokenExpiringSoon(token)) {
                console.log('⏳ Token expira pronto, solicitando nuevo...');
                
                const previousToken = token;
                
                try {
                    const response = await api.post('Auth/RefreshToken', {
                        refreshToken,
                    });
                    
                    const newToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newToken);
                    
                    console.log('🔐 Nuevo accessToken:', newToken);
                    
                    if (previousToken !== newToken) {
                        console.log('✅ Token fue actualizado');
                    } else {
                        console.warn('⚠️ El token no cambió');
                    }
                    
                    const decoded = jwtDecode(newToken);
                    console.log('🕒 Expira a las:', new Date(decoded.exp * 1000).toLocaleString());
                } catch (error) {
                    console.error('❌ Error al refrescar token:', error);
                }
            } else {
                console.log('🔒 Token aún válido, no se refresca.');
            }
        };

        refreshIfNeeded();
    }, [location]);


return null; // No renderiza nada
};
const isTokenExpiringSoon = (token) => {
  try {
    const decoded = jwtDecode(token);
    const expTime = decoded.exp * 1000; // milisegundos
    const now = Date.now();
    const buffer = 60 * 1000; // 1 minuto
    return expTime - now < buffer;
  } catch (error) {
    console.log("refreshToken ya expiro",error);
    return true; 
  }
};

export default TokenRefresher;
