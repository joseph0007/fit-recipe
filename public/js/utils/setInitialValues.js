export const setInitialValues = () => {
  const eleArr = [
    '.select-unit',
    '.nutriprofile__btn-view',
    '.nutriprofile__btn-select',
    '.upload__get-nutri',
    '.upload__set-nutri',
    '.upload__add-button',
    '.upload__delete-button',
  ];

  eleArr.forEach((el) => {
    const ele = document.querySelectorAll(el);
    Array.from(ele).forEach((el1) => {
      if (el1 && el1.isEventListenerSet !== true)
        el1.isEventListenerSet = false;
    });
  });
};
