
const container = document.querySelector('.places__list');
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");

profilePopup.classList.add("popup_is-animated");
cardPopup.classList.add("popup_is-animated");
imagePopup.classList.add("popup_is-animated");

const profileEditBtn = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const popupInputTypeName = document.querySelector(".popup__input_type_name");
const popupInputTypeDescription = document.querySelector(".popup__input_type_description");
const popupInputTypeCardName = document.querySelector(".popup__input_type_card-name");
const popupInputTypeUrl = document.querySelector(".popup__input_type_url");
const profileAddBtn = document.querySelector(".profile__add-button");


function createCard(cardEl){
    const card = document.querySelector('#card-template').content;
    const cardElement = card.querySelector('.places__item.card').cloneNode(true);

    const cardImg =cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');

    cardImg.src = cardEl.link;
    cardTitle.textContent = cardEl.name;

    const cardLikeBtn = cardElement.querySelector(".card__like-button");
    const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

    cardLikeBtn.addEventListener("click", () => {
        cardLikeBtn.classList.toggle("card__like-button_is-active");
    });

    cardDeleteBtn.addEventListener("click", () => {
        initialCards.map((item, index) => {
            if (item.name === cardEl.name) {
                initialCards.splice(index, 1);
                drawCards(initialCards);
            }
        });
    });

    cardImg.addEventListener("click", () => {
        openModal(imagePopup);
        const popupCaption = imagePopup.querySelector(".popup__caption");
        const popupImg = imagePopup.querySelector(".popup__image");
        const popupClose = imagePopup.querySelector(".popup__close");

        popupClose.addEventListener("click", () => {
            closeModal(imagePopup);
        });
        popupImg.src = cardImg.src;
        popupCaption.textContent = cardImg.alt;
    });

    return cardElement;
}

function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove("popup_is-opened");
}

function handleProfileSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = popupInputTypeName.value;
    profileDescription.textContent = popupInputTypeDescription.value;
    closeModal(profilePopup);
}

function showCards(cards) {
    container.innerHTML = "";
    cards.forEach((card) => {
        container.append(createCard(card));
    });
}

function handleCardSubmit(evt) {
    evt.preventDefault();
    initialCards.unshift({
        name: popupInputTypeCardName.value,
        link: popupInputTypeUrl.value,
    });
    showCards(initialCards);
    closeModal(cardPopup);
}

showCards(initialCards);


profileEditBtn.addEventListener("click", () => {
    const popupClose = profilePopup.querySelector(".popup__close");
    const popupForm = profilePopup.querySelector(".popup__form");
    openModal(profilePopup);

    popupClose.addEventListener("click", () => {
        closeModal(profilePopup);
    });
    popupForm.addEventListener("submit", handleProfileSubmit);
    popupInputTypeName.value = profileTitle.textContent;
    popupInputTypeDescription.value = profileDescription.textContent;
});

profileAddBtn.addEventListener("click", () => {
    const popupClose = cardPopup.querySelector(".popup__close");
    const popupForm = cardPopup.querySelector(".popup__form");
    popupInputTypeCardName.value = "";
    popupInputTypeUrl.value = "";
    openModal(cardPopup);

    popupClose.addEventListener("click", () => {
        closeModal(cardPopup);
    });
    popupForm.addEventListener("submit", handleCardSubmit);
});

