import useAuthStore from '@/store/useAuthStore'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'

export const useAuth = () => {
    const authStore = useAuthStore()

    return {
        authorized: authStore.authorized,
        user: authStore.user,
        login(token: string) {
            Cookies.set('token', token, {expires: 30})
            authStore.login(jwt.decode(token))
        },
        logout() {
            Cookies.remove('token')
            authStore.logout()
        }
    }
}
