// Catch DOM Element
const categoryEl = document.getElementById("category-container");

// time converter function
const toStringDateTime = (time) => {
  const hours = parseInt(time / 3600);
  let remainingSec = time % 3600;
  const minutes = parseInt(remainingSec / 60);
  remainingSec = remainingSec % 60;
  return `${hours}h ${minutes}m ${remainingSec}s ago`;
};

// remove all active color function
const removeColor = () => {
  const btnClass = document.getElementsByClassName("category-btn");
  for (const btn of btnClass) {
    btn.classList.remove("active");
  }
};

// Load and fetch Categories
const loadCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/categories"
    );
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
};

// Load and fetch category videos
const loadCategoryVideos = async (id) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
    );
    const data = await res.json();
    removeColor();
    const activeButton = document.getElementById(`btn-${id}`);
    activeButton.classList.add("active");

    displayVideos(data.category);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
};

// display Categories
const displayCategories = (data) => {
  data.map((categoryList) => {
    const category = categoryList.category;
    // create button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
        <button id="btn-${categoryList.category_id}" onclick="loadCategoryVideos(${categoryList.category_id})" class="btn category-btn">${category}</button>
        `;

    // add button to container
    categoryEl.appendChild(buttonContainer);
  });
};

// Load and fetch videos
const loadVideos = async (searchText = "") => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
    );
    const data = await res.json();
    loadViews(data.videos);
    displayVideos(data.videos);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
};

// load views
const loadViews = (sortVideos) => {
  const viewList = [];
  sortVideos.map((sortVideo) => {
    const views = sortVideo.others.views;
    const viewsNum = parseInt(views.split("K")[0]);
    viewList.push(viewsNum);
    const viewID = sortVideo.video_id;
    loadSort(viewID);
  });
  sortArray(viewList);
};

// fuction to array sort
const sortArray = (array) => {
  array.sort((a, b) => b - a);
};

const loadSort = async () => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/video/`
    );
    const data = await res.json();
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
};
// display sort
document.getElementById("sort").addEventListener("click", () => {
  loadVideos();
});

// Details Button
const loadDetails = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${id}`
  );
  const eachVideo = await res.json();
  displayDetails(eachVideo);
};

// Display Details
const displayDetails = (eachVideos) => {
  const image = eachVideos.video.thumbnail;
  const description = eachVideos.video.description;
  console.log(image, description);

  const modalContainer = document.getElementById("modal-container");
  const modalContent = `
  <img src="${image}">
  <p>${description}</p>`;

  modalContainer.innerHTML = modalContent;

  document.getElementById("customModal").showModal();
};

// Display Videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
            <div class="min-h-[300px] flex flex-col justify-center items-center gap-5">
                <img src="./assets/Icon.png" />
                <h2 class="text-3xl text-black font-extrabold">
                No Content Found.
                </h2>
            </div>
            `;
    return;
  } else {
    videoContainer.classList.add("grid");
  }

  videos.map((video) => {
    const card = document.createElement("div");
    card.classList = "card card-compact";
    const cardElement = `
        <figure class="h-[200px] relative">
            <img
            src=${video.thumbnail}
            class="h-full w-full object-cover"
            alt="Shoes" />
            ${
              video.others?.posted_date.length == 0
                ? ""
                : `<span class="text-xs bg-black rounded-lg text-white p-2 absolute right-2 bottom-2">${toStringDateTime(
                    video.others?.posted_date
                  )}</span>`
            }
        </figure>
        <div class="px-0 py-2 flex gap-2 items-center">
            <div>
                <img class="w-10 h-10 rounded-full object-cover" src=${
                  video.authors[0].profile_picture
                } />
            </div>
            <div class="flex items-end gap-3">
                <div>
                    <h2 class="font-bold">${video.title}</h2>
                    <div class="flex gap-1">
                        <p class="text-gray-400">${
                          video.authors[0].profile_name
                        }</p>
                        ${
                          video.authors[0].verified == true
                            ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />`
                            : ""
                        }
                    </div>
                </div>
                <div>
                <button class="btn btn-xs btn-error" 
                        onclick="loadDetails('${video.video_id}')" 
                        >View Details
                </button>
                </div>
            </div>
            
        </div>
        `;
    card.innerHTML = cardElement;

    videoContainer.appendChild(card);
  });
};

// catch input from search box
document.getElementById("search-text").addEventListener("keyup", (event) => {
  const text = event.target.value;
  loadVideos(text);
});

// sort function

loadCategories();
loadVideos();
