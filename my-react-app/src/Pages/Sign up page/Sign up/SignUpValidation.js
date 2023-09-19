export default function validation(values) {
    let errors = {}
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()-_=+{}[\]|\\;:'",.<>/?]{8,}$/

    if (values.username === "") {
        errors.username = "Username field should not be empty"
    } else {
        errors.username = ""
    }

    if (values.email === "") {
        errors.email = "Email field should not be empty"
    }
    else if (!EMAIL_REGEX.test(values.email)) {
        errors.email = "Incorrect email"
    } else {
        errors.email = ""
    }

    if (values.password === "") {
        errors.password = "Password field should not be empty"
    }
    else if (!PASSWORD_REGEX.test(values.password)) {
        errors.password = "Must contain upper and lowercase letter and digit"
    } else {
        errors.password = ""
    }
    return errors;
}