export const extractErrorMessages = (error) => {
  if (!error) return null;

  if (error.response?.data) {
    const data = error.response.data;

       if (Array.isArray(data.error)) {
         const messages = data.error
           .filter((e) => e.field !== "_errors") // skip the vague "Invalid Input"
           .map((e) => e.message);
         if (messages.length) return messages.join(", ");
       }
    // handle Zod validation errors (array format)

    if (data.errors && Array.isArray(data.error)) {
      return data.error.map((err) => err.message).join(",");
    }

    // handle single error message

    if (data.message) {
      return data.message;
    }

    // handle error field

    if (data.error) {
      return data.error;
    }
  }

  // handle network errors

  if (!error.response) {
    return "Network Error , Please check your connection";
  }

  // Fall back to general error

  if (error.message) {
    return error.message;
  }
  // Handle other types of errors

  return "Something went wrong. please try again";
};
