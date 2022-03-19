const handleResponse = (response) => {
    if (response.results) {
      return response.results;
    }
  
    if (response.data) {
      return response.data;
    }
  
    return response;
  }
  
const handleError = (error) => {
    if (error.data) {
        return error.data;
    }
    return error;
}

export {
    handleResponse,
    handleError
}