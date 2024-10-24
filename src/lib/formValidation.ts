export const validateFormInput = (name: string, email: string, message: string) => {
  const errors: { [key: string]: string } = {};

  if (name.length < 2 || name.length > 50) {
    errors.name = "Name must be between 2 and 50 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (message.length < 10 || message.length > 500) {
    errors.message = "Message must be between 10 and 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};