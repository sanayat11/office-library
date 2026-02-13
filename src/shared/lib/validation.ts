export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
        return { isValid: false, message: 'Пароль должен быть не менее 8 символов' };
    }
    if (!/\d/.test(password)) {
        return { isValid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
    }
    if (!/[a-zA-Z]/.test(password)) {
        return { isValid: false, message: 'Пароль должен содержать хотя бы одну букву' };
    }
    return { isValid: true };
};
