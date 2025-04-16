interface SuccessResponseParams {
    status: number;
    message: string;
    data?: any;
  }
  
  export const successResponse = ({ status, message, data = {} }: SuccessResponseParams) => {
    return {
      status,
      message,
      data,
    };
  };
  