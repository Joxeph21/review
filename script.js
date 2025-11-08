import { supabase } from "./supabase.js";
import { toast } from "./toast.js";
const fileInput = document.querySelector("#image-selector");
const fileButton = document.querySelector("#image-container");
const previewImage = document.querySelector("#image-container img");
const SocialsContainer = document.querySelector("#socials-section");
const availableSocials = ["linkedin", "instagram", "x"];
const addSocialsBtn = document.querySelector("#add_social_btn");
const form = document.querySelector("#form-container");
const closeModalBtn = document.querySelector("#close-modal");
const successModal = document.getElementById("success-container");
const modal = document.querySelector("#success-container main");
let hasSocials = false;

const values = {
  name: "",
  title: "",
  content: "",
  socials: [],
  avatar: null,
};

const socialRegex = {
  linkedin:
    /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?(\?.*)?$/i,
  instagram:
    /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?(\?.*)?$/i,
  x: /^(https?:\/\/)?(www\.)?x\.com\/[A-Za-z0-9_]+\/?(\?.*)?$/i,
};

document.addEventListener("DOMContentLoaded", () => {
  closeModalBtn.addEventListener("click", handleModalClose);

  document.querySelectorAll("#role, #content, #name").forEach((el) => {
    const { name, value } = el;
    if (name in values && value.trim() !== "") {
      values[name] = value;
    }

    el.addEventListener("input", handleChange);
  });

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

  fileButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    handleFileChange(e);
  });

  if (checked) {
    document.querySelector("#add_social_btn").style.display = "block";
  } else {
    document.querySelector("#add_social_btn").style.display = "none";
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast?.error("Please select a valid image file.");
    console.error("Please select a valid image file.");
    e.target.value = "";
    return;
  }

  previewImage.src = URL.createObjectURL(file);
  values.avatar = file;
};

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

  if (document.querySelectorAll(".social-container").length >= 2) {
    addSocialsBtn.style.display = "none";
  }
}

function deleteSocial(div) {
  div.remove();

  if (document.querySelectorAll(".social-container").length < 2) {
    addSocialsBtn.style.display = "inline-block";
  }
}

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name in values) {
    values[name] = value;
  }

  if (!value.trim()) {
    e.target.classList.add("error");
  } else {
    e.target.classList.remove("error");
  }
};

async function handleFormSubmit(e) {
  e.preventDefault();

  const titleEL = document.querySelector("#role");
  const contentEl = document.querySelector("#content");
  const nameEl = document.querySelector("#name");

  const title = values.title;
  const content = values.content;
  const name = values.name;

  if (!title && !content && !name) {
    toast.error("Name, title and content are required");
    titleEL.classList.add("error");
    contentEl.classList.add("error");
    return;
  } else if (!title) {
    toast.error("Title is required");
    titleEL.classList.add("error");
    return;
  } else if (!content) {
    toast.error("Content is required");
    contentEl.classList.add("error");
    return;
  } else if (!name) {
    toast.error("Full name is required");
    nameEl.classList.add("error");
    return;
  }

  const socials = [];
  let invalidSocial = false;

  document.querySelectorAll(".social-container").forEach((container) => {
    const platform = container.querySelector("select").value.toLowerCase();
    const input = container.querySelector("input");
    const url = input.value.trim();

    if (url) {
      const regex = socialRegex[platform];
      if (!regex.test(url)) {
        invalidSocial = true;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
        socials.push({ name: platform, url });
      }
    }
  });

  if (invalidSocial) {
    toast.error("Please enter valid links for your socials.");
    return;
  }

  values.title = title;
  values.content = content;
  values.socials = socials;

  const formElements = form.querySelectorAll("input, textarea, button");

  formElements.forEach((el) => {
    el.disabled = true;
    if (el.id === "submit-btn") {
      el.textContent = "Submitting...";
    }
  });

  try {
    let imgName;
    const reviewData = {
      role: values.title,
      content: values.content,
      socials: values.socials,
      name: values.name,
    };

    if (values.avatar instanceof File) {
      const fileExt = values.avatar.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      imgName = fileName;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, values.avatar);

      if (uploadError) throw uploadError;

      const { data: url } = supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path);
      if (url) {
        reviewData.avatar = url.publicUrl;
      }
    }

    console.log({ reviewData });

    const { data, error } = await supabase
      .from("reviews")
      .insert([reviewData])
      .select();

    if (error) throw error;
    if (data) {
      handleModalOpen();
      resetVals();
    }
  } catch (error) {
    toast.error(error?.message || "Something went wrong");
    if (imgName) {
      deleteAvatar(imgName);
    }
  } finally {
  }
  formElements.forEach((el) => {
    el.disabled = false;
    if (el.id === "submit-btn") {
      el.textContent = "Submit Review";
    }
  });
}

function resetVals() {
  form.reset();
  values.title = "";
  values.content = "";
  values.name = "";
  values.socials = [];
  values.avatar = null;
  previewImage.src =
    "https://ftxzkolsexefileehfct.supabase.co/storage/v1/object/public/avatars/avatar.jpg";
  toast.success("Review submitted..Thanks☺️");
  SocialsContainer.style.display = "none";
  hasSocials = false;
}

async function deleteAvatar(filePath) {
  const { data, error } = await supabase.storage
    .from("avatars")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting file:", error);
  } else {
    console.log("File deleted successfully:", data);
  }
}

const handleModalOpen = () => {
  modal.classList.remove("hide");
  successModal.style.display = "flex";
};

const handleModalClose = () => {
  modal.classList.add("hide");
  const onAnimationEnd = () => {
    successModal.style.display = "none";
    modal.removeEventListener("animationend", onAnimationEnd);
  };

  modal.addEventListener("animationend", onAnimationEnd);
};
