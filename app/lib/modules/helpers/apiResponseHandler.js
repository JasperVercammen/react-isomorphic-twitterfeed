/**
 * This will resolve the error (if any) to json and make sure the promise goes into the rejected flow.
 *
 * @param {Response} response
 * @returns {promise}
 **/
function errorResponseHandler(response) {
  if (response.ok) {
    console.log(response.json());
    return response.json();
  } else {
    return response.json().then((error) => {
      throw error;
    });
  }
}

export default errorResponseHandler;

