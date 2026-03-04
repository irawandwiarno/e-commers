export default function validateRegister({ fullName, email, password, confirmPassword }) {
    const errors = {}
    if (!fullName.trim())         errors.fullName        = 'Full name is required.'
    if (!email.trim())            errors.email           = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                  errors.email           = 'Enter a valid email address.'
    if (!password)                errors.password        = 'Password is required.'
    else if (password.length < 8) errors.password        = 'Password must be at least 8 characters.'
    if (!confirmPassword)         errors.confirmPassword = 'Please confirm your password.'
    else if (confirmPassword !== password)
                                  errors.confirmPassword = 'Passwords do not match.'
    return errors
}
