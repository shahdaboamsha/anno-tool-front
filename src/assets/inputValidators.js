const validateName = (input) => {

    const nameRegex = /^[a-zA-Z ]{3,50}$/

    if (!input || input.trim() == "") {
        return "Please enter your name"
    }

    const name = input.trim()
    if (!nameRegex.test(name)) {
        return 'Please enter a valid name, special characters and digits are not allowed and name length must be 3 characters at least'
    }

    return "VALID"
}

const validateEmail = (input) => {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!input || input.trim() == "") {
        return "Please enter your email address"
    }

    const email = input.trim()
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address"
    }
    return "VALID"
}

const validatePassword = (input) => {
    const passwordRegex = /^(?=(.*[A-Z]){1})(?=(.*[\d\W]){1})[A-Za-z\d\W]{8,}$/

    if (!input || input.trim() == "") {
        return "Please enter your account password"
    }

    const password = input.trim()
    if (!passwordRegex.test(password)) {
        return "Weak password, password must be:\n  1. At least 8 chracters.\n2. Contains one or more uppercase letter.\n3. Contains one or more digit."
    }
    return "VALID"
}

const validateConfirmPassword = (input, password) => {

    if (input.trim() === "") {
        return "Please confirm your password"
    }

    if (input.trim() == password.trim())
        return "VALID"
    return "Passwords does not matched"
}

const validateDateOfBirth = (input) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!input || input.trim() == "")
        return "Please enter your date of birth"

    if (!dateRegex.test(input.trim())) {
        return "Please enter a valid birth date"
    }
    return "VALID"
}

const validateSignupDataBeforeSubmit = (formData, setFormData) => {
    // this function validate the date before submission

    const data = {}

    // create a key,value object (userName: "Shahd Mohammad")
    const getKeyValue = () => {
        Object.entries(formData).forEach(input => {
            data[input[0]] = input[1].value
        })
    }

    getKeyValue()

    let newFormData = { ...formData };

    let isReadyForSubmit = true

    // update the formData, this loop checks if there is any value not entered and the user submit, then an error
    // messages will appeared to user.

    for (const key in data) {
        const value = data[key];

        let validationResult = null

        // A special case for confirm password field, it compares the password value with the confirmation value
        if (key === "confirmPassword") {
            validationResult = validate(key, value, data['password'])
        }
        else
            validationResult = validate(key, value)

        if (validationResult !== "VALID") {
            isReadyForSubmit = false
            newFormData[key] = { value, error: validationResult };
        }
    }

    setFormData(newFormData)

    return isReadyForSubmit
}

const validataTaskName = (input) => {
    if (input.trim() === "") {
        return "Please provide task name"
    }
    return "VALID"
}

const validataAnnotationType = (input) => {
    if (input.trim() === "") {
        return "Please select annotation type"
    }
    return "VALID"
}

const validataLables = (input) => {
    if (input.trim() === "") {
        return "Please provide labels"
    }
    return "VALID"
}

const validateFile = (file) => {
    if (file.fileData === "") {
        return "Please upload a file"
    }
    return "VALID"
}


const validateTaskDescription = (input) => {
    return "VALID"
}

const validateTaskFormBeforeSubmit = (fileFormData, setFileFormData) => {

    const data = {}

    const getKeyValue = () => {

        Object.keys(fileFormData).forEach(key => {
            if (key === "file") {
                data[key] = fileFormData[key].values
            } else {
                data[key] = fileFormData[key].value
            }
        })
    }

    getKeyValue()


    let newFormData = { ...fileFormData };

    let isReadyForSubmit = true

    // update the formData, this loop checks if there is any value not entered and the user submit, then an error
    // messages will appeared to user.

    for (const key in data) {
        const value = data[key];

        let validationResult = null

        validationResult = validate(key, value)

        if (validationResult != "VALID") {
            isReadyForSubmit = false
            newFormData[key] = { ...fileFormData[key], errorMsg: validationResult };
        }
    }

    setFileFormData(newFormData)

    return isReadyForSubmit

}
const validate = (fieldName, value, config) => {
    if (fieldName == "userName") {
        return validateName(value)
    }
    else if (fieldName == "email") {
        return validateEmail(value)
    }
    else if (fieldName == "password") {
        return validatePassword(value)
    }
    else if (fieldName == "dateofbirth") {
        return validateDateOfBirth(value)
    }
    else if (fieldName == "confirmPassword") {
        return validateConfirmPassword(value, config)
    }
    else if (fieldName === 'task_name') {
        return validataTaskName(value)
    }
    else if (fieldName === 'annotation_type') {
        return validataAnnotationType(value)
    }
    else if (fieldName === 'labels') {
        return validataLables(value)
    }
    else if (fieldName === 'file') {
        return validateFile(value)
    }
    else if (fieldName === "task_description"){
        return "VALID"
    }
}

export default {
    validate: validate,
    validateSignupDataBeforeSubmit: validateSignupDataBeforeSubmit,
    validateTaskFormBeforeSubmit: validateTaskFormBeforeSubmit
};