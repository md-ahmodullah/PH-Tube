// Catch DOM Element
const categoryEl = document.getElementById('category-container');
const videosEl = document.getElementById('videos');

// time converter function
const toStringDateTime = (time) => {
    const hours = parseInt(time / 3600);
    let remainingSec = time % 3600;
    const minutes = parseInt(remainingSec / 60);
    remainingSec = remainingSec % 60
    return `${hours}h ${minutes}m ${remainingSec}s ago`;
}


// Load and fetch Categories
const loadCategories = async() => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/phero-tube/categories');
        const data = await res.json();
        displayCategories(data.categories);
        
    } catch (error) {
        console.log(`ERROR : ${error}`);
    }
}

// Load and fetch category videos
const loadCategoryVideos = async(id) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`);
        const data = await res.json();
        displayVideos(data.category);
        
    } catch (error) {
        console.log(`ERROR : ${error}`);
    }
}

// display Categories
const displayCategories = (data) => {
    data.map((categoryList) => {
        const category = categoryList.category;
        // create button
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = 
        `
        <button onclick="loadCategoryVideos(${categoryList.category_id})" class="btn">${category}</button>
        `;

        // add button to container
        categoryEl.appendChild(buttonContainer);
    })
}

// Load and fetch videos
const loadVideos = async() => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/phero-tube/videos');
        const data = await res.json();
        displayVideos(data.videos);
    } catch (error) {
        console.log(`ERROR : ${error}`);
    }
}

const displayVideos = (videos) => {
    videos.map((video) => {
        const card = document.createElement('div');
        card.classList = "card card-compact";
        const cardElement = 
        `
        <figure class="h-[200px] relative">
            <img
            src=${video.thumbnail}
            class="h-full w-full object-cover"
            alt="Shoes" />
            ${
                video.others?.posted_date.length == 0 ? '' : `<span class="text-xs bg-black rounded-lg text-white p-2 absolute right-2 bottom-2">${toStringDateTime(video.others?.posted_date)}</span>`
            }
        </figure>
        <div class="px-0 py-2 flex gap-2">
            <div>
                <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} />
            </div>
            <div>
                <h2 class="font-bold">${video.title}</h2>
                <div class="flex items-center gap-1">
                    <p class="text-gray-400">${video.authors[0].profile_name}</p>
                    ${
                        video.authors[0].verified == true ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />` : ''
                    }
                    
                </div>
                <p></p>
            </div>
            
        </div>
        `;
        card.innerHTML = cardElement;

        videosEl.appendChild(card)
    })
}

loadCategories();
loadVideos();