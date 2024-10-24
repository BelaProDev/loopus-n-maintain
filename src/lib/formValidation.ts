export const validateFormInput = (name: string, email: string, message: string) => {
  const errors: { [key: string]: string } = {};

  // Name validation: letters, spaces, and basic punctuation only
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]+$/;
  if (name.length < 2 || name.length > 50) {
    errors.name = "Name must be between 2 and 50 characters";
  } else if (!nameRegex.test(name)) {
    errors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
  }

  // Email validation: standard email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  // Message validation: exclude potentially harmful characters
  const messageRegex = /^[a-zA-ZÀ-ÿ0-9\s\-'\".,!?@#$%&()\r\n]+$/;
  if (message.length < 10 || message.length > 500) {
    errors.message = "Message must be between 10 and 500 characters";
  } else if (!messageRegex.test(message)) {
    errors.message = "Message contains invalid characters. Please use only letters, numbers, and basic punctuation";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function for real-time validation
export const validateField = (name: string, value: string): string | null => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const messageRegex = /^[a-zA-ZÀ-ÿ0-9\s\-'\".,!?@#$%&()\r\n]+$/;

  switch (name) {
    case 'name':
      if (value && !nameRegex.test(value)) {
        return "Name can only contain letters, spaces, hyphens, and apostrophes";
      }
      break;
    case 'email':
      if (value && !emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      break;
    case 'message':
      if (value && !messageRegex.test(value)) {
        return "Message contains invalid characters";
      }
      break;
  }
  return null;
};