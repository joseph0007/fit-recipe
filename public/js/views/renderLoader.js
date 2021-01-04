export const renderLoader = () => {
  const html = `
    <div class="loading">
        <svg>
            <use xlink:href="img/sprite.svg#icon-spinner10"></use>
        </svg>
    </div>
  `;

  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
};

export const removeLoader = () => {
  document.querySelector('.loading').remove();
};
