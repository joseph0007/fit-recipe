import { getNutri, setNutri } from '../views/formUpload';

export const setNutriListeners = () => {
  Array.from(document.querySelectorAll('.upload__get-nutri')).forEach((el) => {
    console.log(el.isEventListenerSet);
    if (!el.isEventListenerSet) {
      el.isEventListenerSet = true;
      el.addEventListener('click', async (e) => {
        e.preventDefault();

        await getNutri(e, el.dataset.for);
      });
    }
  });

  Array.from(document.querySelectorAll('.upload__set-nutri')).forEach((el) => {
    if (!el.isEventListenerSet) {
      el.isEventListenerSet = true;
      el.addEventListener('click', setNutri);
    }
  });
};
