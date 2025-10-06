export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export const getUser = () => {
  const user = localStorage.getItem('user_data');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user_data');
};
