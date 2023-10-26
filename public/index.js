// initialize variables
let fileUploaderInput,
  generateSpriteSheetButton,
  spritePreview,
  spriteSheetContainer,
  spriteSheetDownloadButton,
  loadedImages = [],
  generatedSpriteSheetCardView,
  generatedSpriteSheet,
  cssCode;

const newSpriteImage = new Image();

window.onload = () => {
  fileUploaderInput = document.getElementById("fileUploaderInput");
  generateSpriteSheetButton = document.getElementById(
    "generateSpriteSheetButton"
  );
  spritePreview = document.getElementById("sprite-preview");
  spriteSheetContainer = document.getElementById("sprite-sheet");
  spriteSheetDownloadButton = document.getElementById(
    "spriteSheetDownloadButton"
  );
  cssCode = document.getElementById("cssCode");

  spriteSheetDownloadButton.addEventListener("click", (event) =>
    downloadSprite()
  );

  const dropZone = document.getElementById("dropZone");

  dropZone.addEventListener("dragover", handleDragOver);
  dropZone.addEventListener("dragleave", handleDragLeave);
  dropZone.addEventListener("drop", handleDrop);

  // handle file uploader input change event
  if (fileUploaderInput) {
    fileUploaderInput.addEventListener("change", fileUploaderOnchange);
  }
};

// Handle drapover event
function handleDragOver(e) {
  e.preventDefault();
  e.target.classList.add("drop-zone--over");
}

// Handle dragleave event
function handleDragLeave(e) {
  e.preventDefault();
  e.target.classList.remove("drop-zone--over");
}

// Handle drop event
function handleDrop(e) {
  e.preventDefault();
  e.target.classList.remove("drop-zone--over");
  const files = e.dataTransfer.files;
  fileUploaderInput.files = files;
  if (fileUploaderInput.files.length > 0) {
    fileUploaderOnchange();
  }
}

// clear the sprite sheet preview container
function clearSpriteSheetPreview() {
  while (spritePreview.firstChild) {
    spritePreview.removeChild(spritePreview.firstChild);
  }
  // clear loaded images array
  loadedImages = [];
}

const fileUploaderOnchange = (event) => {
  clearSpriteSheetPreview();
  const loadedFiles = Array.from(fileUploaderInput.files);
  console.log("triggered2");
  loadedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Create a new image element and give it the source of our file
      const image = new Image();
      image.src = event.target.result;
      // When the image is loaded, draw it on the canvas
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Set the canvas width and height
        canvas.width = 50;
        canvas.height = (image.height / image.width) * 50;
        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        // Create a new image element and give it the source of our canvas
        const newSpriteImage = new Image();
        newSpriteImage.src = canvas.toDataURL();
        newSpriteImage.alt = file.name.replace(
          /\.(png|jfif|pjpeg|jpeg|pjp|jpg|webp|gif|ico|bmp|dib|tiff|tif)$/,
          ""
        );
        spritePreview.appendChild(newSpriteImage);
        loadedImages.push(image);
        // auto generate sprite sheet
        setTimeout(() => {
          createSpriteSheet(loadedImages);
        }, 1000);
        // show sprite sheet progress bar
        let spriteSheetProgress = document.getElementById(
          "spriteSheetProgress"
        );
        let noSpriteSheetView = document.getElementById("no-sprite-sheet-view");
        spriteSheetProgress.style.display = "block";
        spriteSheetProgress.style.visibility = "visible";
        noSpriteSheetView.style.display = "none";
        noSpriteSheetView.style.visibility = "hidden";
        setTimeout(() => {
          spriteSheetProgress.style.display = "none";
          spriteSheetProgress.style.visibility = "hidden";
        }, 1000);
      };
    };
    reader.readAsDataURL(file);
  });
};

// clear the sprite sheet container
function clearSpriteSheet() {
  while (spriteSheetContainer.firstChild) {
    spriteSheetContainer.removeChild(spriteSheetContainer.firstChild);
  }
}

const createSpriteSheet = (images) => {
  clearSpriteSheet();
  // determine Sprite Sheet Dimensions
  const totalImages = images.length;
  // calculate the minimum required dimensions for the sprite sheet
  const largestWidth = Math.max(...images.map((image) => image.width));
  const totalWidth = images.reduce((sum, image) => sum + image.width, 0);
  const largestHeight = Math.max(...images.map((image) => image.height));
  const cols = Math.ceil(Math.sqrt(totalImages));
  const rows = Math.ceil(totalImages / cols);
  const spriteHeight = largestHeight;
  const spriteWidth = totalWidth;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  // Set the canvas width and height
  canvas.width = spriteWidth;
  canvas.height = spriteHeight;
  console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
  // Arrange Images on Canvas
  let x = 0;
  let y = 0;
  for (const image of images) {
    const width = image.width;
    const height = image.height;
    ctx.drawImage(image, x, y);
    x += width;
    if (x >= spriteWidth) {
      x = 0;
      y += height;
    }
    console.log(`Image dimensions: ${width}x${height}`);
  }
  newSpriteImage.src = canvas.toDataURL();
  newSpriteImage.alt = "sprite-sheet";
  spriteSheetContainer.appendChild(newSpriteImage);
  // Generate CSS Styles
  let spriteSheetcssCodeLoading = document.getElementById(
    "spriteSheetcssCodeLoading"
  );
  spriteSheetcssCodeLoading.style.display = "block";
  spriteSheetcssCodeLoading.style.visibility = "visible";
  let cssStyles = "";
  cssCode.innerHTML = cssStyles;
  x = 0;
  y = 0;
  for (let i = 0; i < totalImages; i++) {
    const image = images[i];
    const className = `sprite-image-${i}`;
    cssStyles += `
        .${className} {
          background-image: url('sprite-sheet.png');
          background-position: ${x * -1}px ${y * -1}px;
          width: ${image.width}px;
          height: ${image.height}px;
        }
        <br>
      `;
    x += image.width;
    if (x >= spriteWidth) {
      x = 0;
      y += image.height;
    }
  }
  generatedSpriteSheet = newSpriteImage;
  let noCSSCodeView = document.getElementById("no-css-styling-code-view");
  noCSSCodeView.style.display = "none";
  noCSSCodeView.style.visibility = "hidden";
  setTimeout(() => {
    spriteSheetcssCodeLoading.style.display = "none";
    spriteSheetcssCodeLoading.style.visibility = "hidden";
    cssCode.innerHTML = cssStyles;
  }, 1000);
};

const downloadSprite = () => {
  // Create a link element
  const link = document.createElement("a");
  link.download = "sprite-sheet.png";
  link.href = generatedSpriteSheet.src;
  // Append the link to the body
  link.click();
};
