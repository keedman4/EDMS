import { Errors, FormData } from "../form";

export const getRegExp = (type: string) => {
  let regex = null;
  switch (type) {
    case "email":
      regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g;
      break;
    case "password":
      regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      break;
    default:
      break;
  }
  return regex;
};

export const getSentenceFromCamelCase = (message: string) => {
  let pattern = /[A-Za-z]/g;
  let messages = message.match(pattern);
  let errorMessage = "";

  if (messages !== null) {
    for (let i = 0; i < messages.length; i++) {
      errorMessage +=
        messages[i] === messages[i].toUpperCase()
          ? " " + messages[i].toLowerCase()
          : messages[i];
    }
  }

  return errorMessage.trim();
};

export default function CheckFormValidation(
  errors: Errors,
  data: FormData
): Errors {
  const finalErrors: Errors = {};

  Object.keys(data).forEach((key) => {
    const field = data[key];

    // Type guard to check if field is an object with a 'required' property
    if (typeof field === "object" && field?.required) {
      // Now TypeScript knows 'field' is an object with 'required' property
      if (
        field.value === "" ||
        field.value === undefined ||
        field.value === null
      ) {
        finalErrors[key] = `Please enter ${getSentenceFromCamelCase(key)}.`;
      }
    }
  });

  Object.keys(errors).forEach((key) => {
    if (errors[key] !== "") {
      finalErrors[key] = errors[key];
    }
  });

  return finalErrors;
}
