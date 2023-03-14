const form = document.querySelector(".form");
const comments = document.querySelector(".comments__comments-list");
const sortSelect = document.querySelector(".sort-input__form");

form.date.max = new Date().toLocaleDateString("af-ZA");

const throwError = (elem, errorText) => {
  if (elem.querySelector(".error")) return;

  const pError = document.createElement("p");
  pError.classList.add("error");
  pError.innerHTML = errorText;
  elem.append(pError);
}

const createDateObject = (date) => {
  const [year, month, day] = date.split("-");

  return new Date(year, month - 1, day);
}

const craeteNewComment = (name, date, text) => {
  const newComment = document.createElement("li");
  newComment.classList.add("comments__comment", "comment");

  const dateObject = createDateObject(date);
  const now = new Date();
  if (dateObject.getDate() === now.getDate() &&
    dateObject.getMonth() === now.getMonth() &&
    dateObject.getFullYear() === now.getFullYear()) date = "Today";

  if (dateObject.getDate() === now.getDate() - 1 &&
    dateObject.getMonth() === now.getMonth() &&
    dateObject.getFullYear() === now.getFullYear()) date = "Yesterday";

  newComment.innerHTML = `
  <div class="comment__user user">
    <div class="user__img-wrapper">
      <img src="./assets/default_logo_user.jpg" alt="logo">
    </div>
    <p class="user__name">${name}</p>
  </div>
  <div class="comment__comment-data">
    <p class="comment__date">${date.replace(/-/g, ".")}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    <p class="comment__text">${text}</p>
  </div>
  <div class="comment__delete delete">
    <button class="delete__btn btn-icon">
      <div class="delete__img-wrapper">
        <img src="./assets/delete-garbage-remove-svgrepo-com.svg" alt="delete">
      </div>
    </button>
  </div>
  <div class="comment__like like">
    <p class="like__count">0</p>
    <button class="like__btn btn-icon">
      <div class="like__img-wrapper">
        <img src="./assets/heart2-svgrepo-com.svg" alt="like">
      </div>
    </button>
  </div>
  `;
  return newComment;
}

const clearFields = () => {
  form.name.value = "";
  form.date.value = "";
  form.text.value = "";
}

const handleSubmit = (e) => {
  e.preventDefault();

  let isFormCorrect = true;

  const name = form.name.value;
  const date = form.date.value || new Date().toLocaleDateString("af-ZA");
  const text = form.text.value;

  if (!name) {
    throwError(form.name.parentElement, "Name field must be filled");
    isFormCorrect = false;
  }

  if (!text) {
    throwError(form.text.parentElement, "Comment field must be filled");
    isFormCorrect = false;
  }

  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throwError(form.date.parentElement, "Incorrent date format");
    isFormCorrect = false;
  }

  if (createDateObject(date).getTime() > Date.now()) {
    throwError(form.date.parentElement, "This date cannot be stated");
    isFormCorrect = false;
  }

  if (!isFormCorrect) return;

  clearFields();

  const newComment = craeteNewComment(name, date, text);
  comments.prepend(newComment);

  sortBy(sortSelect.sort.value);
}

const clearError = (e) => {
  if (e.key === "Enter") return;
  const errorElem = e.target.nextElementSibling;
  if (errorElem?.classList.contains("error")) errorElem.remove();
}

const format = (date) => {
  if (date.split(",")[0] === "Today") {
    const data = new Date(Date.now()).toLocaleDateString("af-ZA") + "," + date.split(",")[1];
    return new Date(data.replace(/-/g, "."));
  }

  if (date.split(",")[0] === "Yesterday") {
    const data = new Date(Date.now() - 86400 * 1000).toLocaleDateString("af-ZA") + "," + date.split(",")[1];
    return new Date(data.replace(/-/g, "."));
  };

  return new Date(date);
}

const sortBy = (sortType) => {

  const commentElems = Array.from(comments.querySelectorAll(".comment"));

  switch (sortType) {

    case "oldest":
      commentElems.sort((a, b) => {
        const date1 = format(a.querySelector(".comment__date").innerHTML);
        const date2 = format(b.querySelector(".comment__date").innerHTML);

        return date1.getTime() - date2.getTime();
      });
      break;

    case "newest":
      commentElems.sort((a, b) => {
        const date1 = format(a.querySelector(".comment__date").innerHTML);
        const date2 = format(b.querySelector(".comment__date").innerHTML);

        return date2.getTime() - date1.getTime();
      });
      break;

    case "most popular":
      commentElems.sort((a, b) => {
        const likeCount1 = Number(a.querySelector(".like__count").innerHTML);
        const likeCount2 = Number(b.querySelector(".like__count").innerHTML);

        return likeCount2 - likeCount1;
      })
      break;

    case "least popular":
      commentElems.sort((a, b) => {
        const likeCount1 = Number(a.querySelector(".like__count").innerHTML);
        const likeCount2 = Number(b.querySelector(".like__count").innerHTML);

        return likeCount1 - likeCount2;
      })
      break;
  }

  comments.append(...commentElems);
}

const handleCommentClick = (e) => {
  const likeBtn = e.target.closest(".like__btn");
  const deleteBtn = e.target.closest(".delete__btn");

  if (!likeBtn && !deleteBtn) return;

  if (deleteBtn) {
    deleteBtn.closest(".comment").remove();
  }

  if (likeBtn) {
    const count = likeBtn.previousElementSibling;
    count.innerHTML = likeBtn.classList.contains("liked")
      ? Number(count.textContent) - 1
      : Number(count.textContent) + 1;

    likeBtn.classList.toggle("liked");
  }
}

const handleSortChange = (e) => {
  const sortType = e.target.value;
  sortBy(sortType);
}

form.onkeydown = clearError;
form.onsubmit = handleSubmit;
form.text.onkeydown = (e) => {
  if (e.key === "Enter") handleSubmit(e);
}

comments.onclick = handleCommentClick;

sortSelect.onchange = handleSortChange;