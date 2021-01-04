export const dispMessage = (msg) => {
  const html = `
    <div class="error">${msg}</div>
    `;

  const body = document.querySelector('body');

  body.insertAdjacentHTML('afterbegin', html);

  setTimeout(() => {
    document.querySelector('.error').remove();
  }, 5000);
};
