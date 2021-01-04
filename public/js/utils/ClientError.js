class ClientError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  getHTML() {
    return `
      <div class="error">${this.message}</div>
      `;
  }

  addErrorMessage() {
    document
      .querySelector('body')
      .insertAdjacentHTML('afterbegin', this.getHTML());

    setTimeout(() => {
      this.removeErrorMessage();
    }, 5000);
  }

  removeErrorMessage() {
    document.querySelector('.error').remove();
  }
}

export default ClientError;
