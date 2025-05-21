const showInputError = (
  formElement,
  inputElement,
  inputErrorClass,
  errorMessage,
  errorClass
) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;
};

const hideInputError = (
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";
};

const resetValidation = (formElement, validationSettings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationSettings.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(
      formElement,
      inputElement,
      validationSettings.inputErrorClass,
      validationSettings.errorClass
    );
  });

  toggleButtonState(
    inputList,
    buttonElement,
    validationSettings.inactiveButtonClass
  );
};

const checkInputValidity = (formElement, inputElement, settings) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      settings.inputErrorClass,
      inputElement.validationMessage,
      settings.errorClass
    );
  } else {
    hideInputError(
      formElement,
      inputElement,
      settings.inputErrorClass,
      settings.errorClass
    );
  }
};

const validateForm = (formElement, validationSettings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationSettings.submitButtonSelector
  );

  toggleButtonState(
    inputList,
    buttonElement,
    validationSettings.inactiveButtonClass
  );
  inputList.forEach((inputElement) => {
    checkInputValidity(formElement, inputElement, validationSettings);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
  }
};

const setEventListeners = (formElement, validationSettings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationSettings.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, validationSettings);
      toggleButtonState(
        inputList,
        buttonElement,
        validationSettings.inactiveButtonClass
      );
    });
  });
};

const enableValidation = (validationSettings) => {
  const formList = Array.from(
    document.querySelectorAll(validationSettings.formSelector)
  );
  formList.forEach((formElement) => {
    setEventListeners(formElement, validationSettings);
  });
};

export { resetValidation, enableValidation, validateForm };
