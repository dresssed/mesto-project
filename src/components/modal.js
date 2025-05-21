function closeModalByEsc(evt) {
    if (evt.key === "Escape") {
      const openedModal = document.querySelector('.popup_is-opened');
      closeModal(openedModal);
    }
  }
  
  let isMouseOnOverlay = false;
  
function handleMouseDown(event) {
    isMouseOnOverlay = (event.target === event.currentTarget);
}
  

function handleMouseUp(event) {
    if (event.target !== event.currentTarget) {
      isMouseOnOverlay = false;
    }
}
  

function changeCursorMouseover(event) {
    if (event.target === event.currentTarget) {
      event.target.style.cursor = "pointer";
    }
}
  

function changeCursorMouseout(event) {
    if (event.target === event.currentTarget) {
      event.target.style.cursor = "default";
    }
}
  

function openModal(popup) {
  
    function handleClose() {
      closeModal(popup);
      popup.querySelector('.popup__close').removeEventListener('click', handleClose);
  
      popup.removeEventListener('click', handleOverlayClose);
      popup.removeEventListener('mousedown', handleMouseDown);
      popup.removeEventListener('mouseup', handleMouseUp);
      popup.removeEventListener('mouseover', changeCursorMouseover);
      popup.removeEventListener('mouseout', changeCursorMouseout);
  
      document.removeEventListener('keydown', closeModalByEsc);
    }
  
    function handleOverlayClose(event) {
      if (isMouseOnOverlay && event.target === event.currentTarget) {
        handleClose();
      }
    }
  
    popup.classList.add('popup_is-opened');
  
    popup.querySelector('.popup__close').addEventListener('click', handleClose);
  
    popup.addEventListener('click', handleOverlayClose);
    popup.addEventListener('mousedown', handleMouseDown);
    popup.addEventListener('mouseup', handleMouseUp);
    popup.addEventListener('mouseover', changeCursorMouseover);
    popup.addEventListener('mouseout', changeCursorMouseout);
  
    document.addEventListener('keydown', closeModalByEsc);
}
  

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}
  
export { closeModal, openModal };
  