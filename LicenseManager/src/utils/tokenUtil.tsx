// Define functions to handle token storage
const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const removeToken = (): void => {
    localStorage.removeItem('token');
};

export { 
    setToken,
    getToken,
    removeToken
}