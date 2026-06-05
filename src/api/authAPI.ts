import { localService } from '../services/local';
import { httpService } from '../services/http';
import { BASE_URL } from './baseURL';

const LOGIN_URL = BASE_URL + 'auth/login';
const REGISTER_URL = BASE_URL + 'auth/register';

export const login = async (payload: { emailID?: string; email?: string; password: string }) => {
  const email = payload.emailID || payload.email;
  const response = await httpService.postRequest(LOGIN_URL, { email, password: payload.password });
  if (response && response.status === 1) {
    if(response.data.password) delete response.data.password;
    localService.setUser(JSON.stringify(response.data));
    return {
      user: {
        id: response.data.user_id || response.data.id,
        email: response.data.email,
        name: response.data.full_name || response.data.name,
        role: response.data.role || 'User',
        phone: response.data.phone,
        status: response.data.status || 'Active',
        logo: response.data.logo,
      },
      token: localService.getToken()
    };
  }
  throw new Error(response?.info || response?.message || 'Login failed');
};

export const register = async (payload: any) => {
  const response = await httpService.postRequest(REGISTER_URL, payload);
  if (response && response.status === 1) {
    if(response.data.password) delete response.data.password;
    localService.setUser(JSON.stringify(response.data));    
    return {
      user: {
        id: response.data.user_id || response.data.id,
        email: response.data.email,
        name: response.data.full_name || response.data.name,
        role: response.data.role || 'User',
        phone: response.data.phone,
        status: response.data.status || 'Active',
        logo: response.data.logo,
      },
      token: localService.getToken()
    };
  }
  throw new Error(response?.info || response?.message || 'Registration failed');
};

export const logout = () => {
  localService.logout();
};