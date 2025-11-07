let hasSocials = false;

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#add_social_btn")
    .addEventListener("click", addSocial);
  document
    .querySelector("#form-container")
    .addEventListener("submit", handleFormSubmit);
  document
    .querySelector("#addSocial")
    .addEventListener("change", toggleSocials);
  const checked = document.querySelector("#addSocial").checked;
  hasSocials = checked;

  if (checked) {
    document.querySelector("#add_social_btn").style.display = "block";
  } else {
    document.querySelector("#add_social_btn").style.display = "none";
  }
});

const values = {
  title: "",
  content: "",
  socials: [],
};

const SocialsContainer = document.querySelector("#socials-section");
const availableSocials = ["linkedin", "instagram", "x"];
const addSocialsBtn = document.querySelector("#add_social_btn");
const form = document.querySelector("#form-container");

function toggleSocials(e) {
  hasSocials = e.target.checked;

  if (!hasSocials) {
    SocialsContainer.style.display = "none";
    SocialsContainer.querySelectorAll(".social-container").forEach((node) =>
      node.remove()
    );
    addSocialsBtn.style.display = "inline-block";
    addSocialsBtn.style.display = "none";
    values.socials = [];
  } else {
    SocialsContainer.style.display = "flex";
    addSocialsBtn.style.display = "block";
  }
}

function addSocial() {
  const currentSocials = document.querySelectorAll(".social-container").length;
  if (currentSocials >= 2) return;

  const div = document.createElement("div");
  div.classList.add("social-container");

  const select = document.createElement("select");
  select.name = "social-chooser";
  select.innerHTML = `
    ${availableSocials
      .map(
        (s) =>
          `<option value="${s}">${
            s.charAt(0).toUpperCase() + s.slice(1)
          }</option>`
      )
      .join("")}
  `;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Enter social URL...`;

  const button = document.createElement("button");
  button.id = "close-btn";
  button.type = "button";
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"/>
    </svg>
  `;
  button.onclick = () => deleteSocial(div);

  div.appendChild(select);
  div.appendChild(input);
  div.appendChild(button);

  SocialsContainer.insertBefore(div, addSocialsBtn);

  // Hide after reaching 2
  if (document.querySelectorAll(".social-container").length >= 2) {
    addSocialsBtn.style.display = "none";
  }
}

function deleteSocial(div) {
  div.remove();

  // Re-enable Add button
  if (document.querySelectorAll(".social-container").length < 2) {
    addSocialsBtn.style.display = "inline-block";
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.querySelector("#role").value.trim();
  const content = document.querySelector("#content").value.trim();

  if (!title || !content) {
    alert("Please fill in your title and review.");
    return;
  }

  const socials = [];
  document.querySelectorAll(".social-container").forEach((container) => {
    const name = container.querySelector("select").value;
    const url = container.querySelector("input").value.trim();
    if (name && url) socials.push({ name, url });
  });

  values.title = title;
  values.content = content;
  values.socials = socials;

  console.log("📦 Submitted data:", values);

  alert("Thank you for your review!");
  form.reset();
  SocialsContainer.style.display = "none";
  hasSocials = false;
}
