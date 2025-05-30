import "../pages/index.css";
import { createCard, updateCardLikes } from "./card.js";
import {resetValidation, enableValidation, validateForm} from "./validate.js";
import { openModal, closeModal } from "./modal.js";
import {getInitialCards, getUserInfo, changeUserInfo, changeAvatar, addCard, deleteCard, toggleLike} from "./api.js";

const placesList = document.querySelector(".places__list");

const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const avatarPopup = document.querySelector(".popup_type_avatar");

profilePopup.classList.add("popup_is-animated");
cardPopup.classList.add("popup_is-animated");
imagePopup.classList.add("popup_is-animated");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const profileAvatarOverlay = document.querySelector(".profile__image-overlay");

const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

const profileEditBtn = document.querySelector(".profile__edit-button");
const profileAddBtn = document.querySelector(".profile__add-button");

const profileFormElement = profilePopup.querySelector(".popup__form");
const profileFormBtn = profileFormElement.querySelector(".popup__button");
const nameInput = profileFormElement.querySelector(".popup__input_type_name");
const aboutInput = profileFormElement.querySelector(
  ".popup__input_type_description"
);
nameInput.value = profileTitle.textContent;
aboutInput.value = profileDescription.textContent;

const cardForm = cardPopup.querySelector(".popup__form");
const cardFormBtn = cardForm.querySelector(".popup__button");
const cardNameInput = cardForm.querySelector(
  ".popup__input_type_card-name"
);
const cardInputTypeUrl = cardForm.querySelector(".popup__input_type_url");

const avatarForm = avatarPopup.querySelector(".popup__form");
const avatarFormBtn = avatarForm.querySelector(".popup__button");
const avatarInputTypeUrl = avatarForm.querySelector(
  ".popup__input_type_url"
);

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationSettings);

let userId;

placesList.addEventListener("click", (event) => {
  if (event.target.classList.contains("card__image")) {
    popupImage.src = "";
    popupImage.src = event.target.src;
    popupCaption.textContent = event.target.alt;
    openModal(imagePopup);
  } else if (event.target.classList.contains("card__like-button")) {
    event.target.disabled = true;
    const cardItem = event.target.closest(".places__item");
    let type;
    if (event.target.classList.contains("card__like-button_is-active")) {
      type = "DELETE";
    } else {
      type = "PUT";
    }
    toggleLike(cardItem.id, type)
      .then((cardInfo) => {
        const newCardItem = updateCardLikes(cardItem, cardInfo.likes.length);
        cardItem.replaceWith(newCardItem);
        event.target.classList.toggle("card__like-button_is-active");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        event.target.disabled = false;
      });
  } else if (event.target.classList.contains("card__delete-button")) {
    event.target.disabled = true;
    const cardItem = event.target.closest(".places__item");
    deleteCard(cardItem.id)
      .then((res) => {
        cardItem.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfo, cards]) => {
    profileTitle.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
    userId = userInfo._id;

    cards.forEach((cardInfo) => {
      const link = cardInfo.link;
      const name = cardInfo.name;
      const likesCount = cardInfo.likes.length;
      const _id = cardInfo._id;
      const newCard = createCard(link, name, likesCount, _id);
      if (cardInfo.likes.some((user) => user._id === userId)) {
        newCard
          .querySelector(".card__like-button")
          .classList.add("card__like-button_is-active");
      }
      if (cardInfo.owner._id !== userId) {
        newCard
          .querySelector(".card__delete-button")
          .classList.add("card__delete-button_unactive");
      }
      placesList.append(newCard);
    });
  })
  .catch((err) => {
    console.log(err);
  });


profileAvatarOverlay.addEventListener("click", (event) => {
  avatarInputTypeUrl.value = profileAvatar.style.backgroundImage.slice(5, -2);
  validateForm(avatarForm, validationSettings);
  openModal(avatarPopup);
});

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  avatarFormBtn.textContent = "Сохраняем...";
  avatarFormBtn.classList.add(validationSettings.inactiveButtonClass);
  avatarFormBtn.disabled = true;
  const body = {
    avatar: avatarInputTypeUrl.value,
  };

  changeAvatar(body)
    .then((userInfo) => {
      profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      avatarFormBtn.textContent = "Сохранить";
      avatarFormBtn.classList.remove(validationSettings.inactiveButtonClass);
      avatarFormBtn.disabled = false;
    });
}

avatarPopup.addEventListener("submit", handleAvatarFormSubmit);

profileEditBtn.addEventListener("click", (event) => {
  nameInput.value = profileTitle.textContent;
  aboutInput.value = profileDescription.textContent;

  validateForm(profileFormElement, validationSettings);
  openModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileFormBtn.textContent = "Сохраняем...";
  profileFormBtn.classList.add(validationSettings.inactiveButtonClass);
  profileFormBtn.disabled = true;
  const body = {
    name: nameInput.value,
    about: aboutInput.value,
  };

  changeUserInfo(body)
    .then((userInfo) => {
      profileTitle.textContent = userInfo.name;
      profileDescription.textContent = userInfo.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      profileFormBtn.textContent = "Сохранить";
      profileFormBtn.classList.remove(validationSettings.inactiveButtonClass);
      profileFormBtn.disabled = false;
    });
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

profileAddBtn.addEventListener("click", () => {
  cardInputTypeUrl.value = "";
  cardNameInput.value = "";

  resetValidation(cardForm, validationSettings);
  openModal(cardPopup);
});

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  cardFormBtn.textContent = "Создаем...";
  cardFormBtn.classList.add(validationSettings.inactiveButtonClass);
  cardFormBtn.disabled = true;
  const body = {
    name: cardNameInput.value,
    link: cardInputTypeUrl.value,
  };

  addCard(body)
    .then((cardInfo) => {
      const link = cardInfo.link;
      const name = cardInfo.name;
      const likesCount = cardInfo.likes.length;
      const _id = cardInfo._id;
      const newCard = createCard(link, name, likesCount, _id);
      placesList.prepend(newCard);
      closeModal(cardPopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      cardFormBtn.textContent = "Создать";
      cardFormBtn.classList.remove(validationSettings.inactiveButtonClass);
      cardFormBtn.disabled = false;
    });
}

cardForm.addEventListener("submit", handleCardFormSubmit);


