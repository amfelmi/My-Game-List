export default function validation(values) {
    let error = {}
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+&/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    if (values.email === "") {
        error.email = "Email field should not be empty"
    }
    else if (!EMAIL_REGEX.test(values.email)) {
        error.email = "Email didn't match"
    } else {
        error.email = ""
    }

    if (values.password === "") {
        error.password = "Password field should not be empty"
    }
    else if (!PASSWORD_REGEX.test(values.password)) {
        error.password = "Password didn't match"
    } else {
        error.password = ""
    }
    return error;
}