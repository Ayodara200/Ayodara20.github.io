// All DOM elements
const domElements={
    jobsContainer : document.querySelector('.jobs'),
    searchContainer : document.querySelector('.search'),
    searchFilters : document.querySelector('.search-content'),
    clear : document.querySelector('.clear'),
}


// Function for fetching data
const  fetchData = async ()=>{
    const res = await fetch("./data.json");
    const data = await res.json();

    return data;

};



const makeCards = (item)=>{
    return `
        ${cardBorder(item.featured,item)}
        <h2 class="profile flex">
            <img class="image" src=${item.logo} alt="">
            <div class="company-desc">
                <div class="company-field">
                    <span class="company">${item.company}</span>
                    ${createNewFlags(item.new,item.featured)}
                </div>
                <div class="job-position">${item.position}</div>
                <div class="job-info flex">
                    <span class="posted info">${item.postedAt}</span>
                    <ul class="flex">
                        <li class="contract info">${item.contract}</li>
                        <li class="country info">${item.location}</li>
                    </ul>
                </div>
            </div>
        </h2>
        <h2 class="skills flex">
            <span class="role filter">${item.role}</span>
            <span class="level filter">${item.level}</span>
            ${createLang(item.languages)}
            ${createTools(item.tools)}
        </h2>
    </div>
    `;
};


// Show cards
const showCards = () =>{
    let cards="";
    fetchData().then((data) => {
        data.forEach((text)=>{
            cards += makeCards(text);
            domElements.jobsContainer.innerHTML=cards;
        });
    })  
};

showCards();

// Add featured border
const cardBorder = (featured) =>{
    if(featured){
        return `<div class="wrapper flex featured-border">`;
    }

    return `<div class="wrapper flex">`;
};


// Create New Cards
const createNewFlags = (newFlag,featuredFlag) => {
    let flag="";
    if(newFlag)   flag +=`<span class="new">New!</span>`
    if(featuredFlag) {
        flag +=`<span class="featured">Featured</span>`;
    }
    return flag;
};


// Create Language Cards
const createLang = (langs)=>{
    let langCards="";
    langs.forEach((lang)=>{
        langCards += `<span class="lang filter">${lang}</span>`;
    });
    return langCards;
};

// Create Tools Cards
const createTools = (tools)=>{
    let toolCards="";
    tools.forEach((tool)=>{
        toolCards += `<span class="lang filter">${tool}</span>`;
    });
    return toolCards;
};


// Display Search Bar
const displaySearch = (e) =>{
    let element=e.target;
    if(element.classList.contains('filter')){
        domElements.searchContainer.classList.remove('hidden');
        displayFilter(element);
    }
};

let filterArray=[];

// Display filter on Search
const displayFilter = (ele) => {
    let filter="";
    if(! filterArray.includes(ele.textContent)){
        filterArray.push(ele.textContent);
    }  

    filterArray.forEach((element) => {
        filter +=`
        <div class="search-filter">
        <span class="filter-content">${element}
        <span class="filter-remove"> &#9747;</span>
        </span>
        </div> 
        `;
        domElements.searchFilters.innerHTML=filter;
        filterJob();
    })

};

// Update jobs list by changing filters
const filterJob = (data)=>{
    if(filterArray.length !== 0){
        let cards="";
        fetchData().then((data) => {
            data.forEach((text)=>{
                    if(validJobs(text)){
                    cards += makeCards(text);
                    domElements.jobsContainer.innerHTML=cards;
                }
            });
        })  
    }
    else{
        domElements.searchContainer.classList.add('hidden');
        showCards(data);
    }
} 

// Jobs are valid or not
const validJobs = (item) => {
        let isValid = true;
        filterArray.forEach(elem => {
            if( item.role !== elem && item.level !== elem && !item.languages.includes(elem) && !item.tools.includes(elem)){
                isValid = false;
            }
        })
        return isValid;
}


// Remove filter
const removeFilter = (e) => {
    let element = e.target;
    if(element.classList.contains('filter-remove')){
        const elementToRemove=element.parentElement;
        let index = filterArray.indexOf(elementToRemove.textContent.split(" ")[0].trim());
        filterArray.splice(index,1);
        elementToRemove.remove();
        filterJob();
    }
}

// Clear Search
const clearSearch = () => {
    domElements.searchContainer.classList.add('hidden');
    filterArray=[];
    filterJob();
}

// All DOM Event Listeners
domElements.jobsContainer.addEventListener('click',displaySearch);
domElements.searchFilters.addEventListener('click',removeFilter);
domElements.clear.addEventListener('click',clearSearch);