//--Copyright (c) Robert A. Howell  May, 2023
export function apiGET() {
    return fetch("https://api.adviceslip.com/advice")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
        throw response;
      })
  };
