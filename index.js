const frames = [
  {
    name: "picture_frame_PNG217.png",
    path: "assets/frames/picture_frame_PNG217.png",
    width: 799,
    height: 800,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG218.png",
    path: "assets/frames/picture_frame_PNG218.png",
    width: 1600,
    height: 1131,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG219.png",
    path: "assets/frames/picture_frame_PNG219.png",
    width: 1600,
    height: 1455,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG220.png",
    path: "assets/frames/picture_frame_PNG220.png",
    width: 924,
    height: 1083,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG221.png",
    path: "assets/frames/picture_frame_PNG221.png",
    width: 2000,
    height: 2151,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG222.png",
    path: "assets/frames/picture_frame_PNG222.png",
    width: 2000,
    height: 2000,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG223.png",
    path: "assets/frames/picture_frame_PNG223.png",
    width: 960,
    height: 657,
    centerAlpha: 0
  },
  {
    name: "picture_frame_PNG224.png",
    path: "assets/frames/picture_frame_PNG224.png",
    width: 720,
    height: 393,
    centerAlpha: 0
  }
];

const state = {
  index: Math.floor(Math.random() * frames.length)
};

const stage = document.querySelector("#stage");
const frameImage = document.querySelector("#frame-image");
const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const frameName = document.querySelector("#frame-name");
const frameCounter = document.querySelector("#frame-counter");
const frameDimensions = document.querySelector("#frame-dimensions");
const frameAlpha = document.querySelector("#frame-alpha");
const framePath = document.querySelector("#frame-path");
const thumbGrid = document.querySelector("#thumb-grid");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");

function mod(value, length) {
  return (value + length) % length;
}

function createThumb(frame, index) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  const label = document.createElement("span");

  button.className = "thumb";
  button.type = "button";
  button.dataset.index = String(index);
  button.setAttribute("aria-label", `Use ${frame.name}`);

  image.src = frame.path;
  image.alt = "";
  label.textContent = `${frame.width} x ${frame.height}`;

  button.append(image, label);
  button.addEventListener("click", () => {
    updateFrame(index);
  });

  return button;
}

function renderThumbs() {
  thumbGrid.replaceChildren(...frames.map(createThumb));
}

function updateThumbState() {
  const thumbs = thumbGrid.querySelectorAll(".thumb");

  thumbs.forEach((thumb, index) => {
    const isActive = index === state.index;

    thumb.classList.toggle("is-active", isActive);
    thumb.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateOverlayField(element, options) {
  const {
    text,
    x,
    y,
    size,
    color
  } = options;

  element.value = text;
  element.style.left = x;
  element.style.top = y;
  element.style.fontSize = size;
  element.style.color = color;
  element.style.transform = "translate(-50%, -50%)";
}

function positionQuoteFields() {
  updateOverlayField(quoteText, {
    text: quoteText.value || "Write the quote here",
    x: "38%",
    y: "48%",
    size: quoteText.style.fontSize || "44px",
    color: quoteText.style.color || "#1f1a16"
  });

  updateOverlayField(quoteAuthor, {
    text: quoteAuthor.value || "- Author",
    x: "70%",
    y: "67%",
    size: quoteAuthor.style.fontSize || "20px",
    color: quoteAuthor.style.color || "#4c4037"
  });
}

function updateFrame(index) {
  state.index = mod(index, frames.length);

  const frame = frames[state.index];

  stage.style.aspectRatio = `${frame.width} / ${frame.height}`;
  frameImage.src = frame.path;
  frameImage.alt = frame.name;
  frameName.textContent = frame.name;
  frameCounter.textContent = `${state.index + 1} of ${frames.length}`;
  frameDimensions.textContent = `${frame.width} x ${frame.height}`;
  frameAlpha.textContent = String(frame.centerAlpha);
  framePath.textContent = frame.path;

  updateThumbState();
  positionQuoteFields();
}

prevButton.addEventListener("click", () => {
  updateFrame(state.index - 1);
});

nextButton.addEventListener("click", () => {
  updateFrame(state.index + 1);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    updateFrame(state.index - 1);
  }

  if (event.key === "ArrowRight") {
    updateFrame(state.index + 1);
  }
});

quoteText.addEventListener("input", () => {
  positionQuoteFields();
});

quoteAuthor.addEventListener("input", () => {
  positionQuoteFields();
});

renderThumbs();
updateFrame(state.index);

setInterval(() => {
  updateFrame(state.index + 1);
}, 5000);
