const bookDiv = document.querySelector(".show-books");
const result = document.getElementById("show-books");

// fetch language
let lan = localStorage.getItem("language") || "en";

var language = document.querySelectorAll("#dropdown-languages li")

for (var i = 0; i < language.length; i++) {

  language[i].onclick = function getSelectValue2() {

    var selectValue2 = this.innerText;
    document.getElementById("en").innerText = selectValue2;
    document.getElementById("en").style.fontSize = "18px";
    document.getElementById("en").style.textTransform = "uppercase";

    localStorage.setItem("language", selectValue2);

  }
}

// favorites 
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// favorites best sellers

let bestSellersfavorites = JSON.parse(localStorage.getItem("bestSellersfavorites")) || [];


// best sellers

window.addEventListener("load", () => {
  fetch('https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=6ad84e249d054efeaefe1abb8f89df5b', {
    method: 'get',
  })
    .then(response => { return response.json(); })
    .then(json => {
      console.log(json);
      updateBestSellers(json)
    })

})

function updateBestSellers(nytimesBestSellers) {

  nytimesBestSellers.results.forEach(function(book) {
    var isbn = book.isbns[0].isbn10;
    var bookInfo = book.book_details[0];
    var lastWeekRank = book.rank_last_week || 'n/a';
    var weeksOnList = book.weeks_on_list || 'New this week!';
    let viewUrl = 'book.html?isbn=' + isbn;

    const result3 = document.createElement("div");
    result3.classList.add("entry");
    // result3.setAttribute('id', book.rank);

    const bookCell = document.createElement("div");
    bookCell.classList.add("book-cell");
    result3.appendChild(bookCell);

    const bookImg = document.createElement("div");
    bookImg.classList.add("book-img");
    bookCell.appendChild(bookImg);

    const img = document.createElement("img");
    img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/387928/book%20placeholder.png";
    img.classList.add("book-cover");
    img.classList.add("book-photo");
    img.setAttribute('id', "cover-" + book.rank);
    bookImg.appendChild(img);

    const bookContent = document.createElement("div");
    bookContent.classList.add("book-content");
    bookCell.appendChild(bookContent);

    const saveButton = document.createElement("button");
    saveButton.classList.add("save_button");
    bookContent.appendChild(saveButton);

    const saveIcon = document.createElement("img");
    // saveIcon.classList.add("save_button");
    saveIcon.src = "images/saveButton.png";
    saveButton.appendChild(saveIcon);

    // favorites functionality

    saveButton.onclick = function saveFavorite() {

      const best = {

        isbn: isbn,
        bookInfo: bookInfo,
        lastWeekRank: lastWeekRank,
        weeksOnList: weeksOnList,
        viewUrl: viewUrl,
        rank: book.rank,

      }

      bestSellersfavorites.push(best);
      localStorage.setItem("bestSellersfavorites", JSON.stringify(bestSellersfavorites));

      alertAdded();

      // display_bestSellers();

    }

    const titleElement = document.createElement("h2");
    titleElement.classList.add("book-title");
    titleElement.textContent = bookInfo.title;
    bookContent.appendChild(titleElement);

    const authorElement = document.createElement("h4");
    authorElement.classList.add("book-author");
    authorElement.textContent = `By ${bookInfo.author}`;
    bookContent.appendChild(authorElement);

    const publisherElement = document.createElement("h4");
    publisherElement.classList.add("publisher");
    publisherElement.textContent = `Publisher: ${bookInfo.publisher}`;
    bookContent.appendChild(publisherElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("book-sum");
    descriptionElement.textContent = bookInfo.description;
    bookContent.appendChild(descriptionElement);

    const hr = document.createElement("hr");
    bookContent.appendChild(hr);

    const stats = document.createElement("div");
    stats.classList.add("stats");
    bookContent.appendChild(stats);

    const lastWeek = document.createElement("p");
    lastWeek.textContent = `Last Week:  ${lastWeekRank} `;
    stats.appendChild(lastWeek);

    const weekdOnList = document.createElement("p");
    weekdOnList.textContent = `Weeks on list:  ${weeksOnList} `;
    stats.appendChild(weekdOnList);

    // const line_break = document.createElement("hr");
    // bookContent.appendChild(line_break);

    const amazon = document.createElement("a");
    amazon.setAttribute('target', '_blank');
    amazon.classList.add("book-see1");
    amazon.textContent = "Buy From Amazon";
    amazon.href = `${book.amazon_product_url}`
    bookContent.appendChild(amazon);

    // const link = document.createElement("a");
    // link.setAttribute('target', '_blank');
    // link.classList.add("book-see2");
    // link.textContent = "Read The Book";
    // link.href = viewUrl
    // bookContent.appendChild(link);


    const emptyDiv = document.getElementById("best-seller-titles");
    emptyDiv.appendChild(result3);

    updateCover(book.rank, isbn);
  });
}

function updateCover(id, isbn) {
  fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn, {
    method: 'get'
  })
    .then(response => { return response.json(); })
    .then(data => {
      console.log(data)
      var imgSrc = data.items[0].volumeInfo.imageLinks.thumbnail;
      imgSrc = imgSrc.replace(/^http:\/\//i, 'https://');
      document.querySelector("#cover-" + id).src = imgSrc;

      console.log("hey!im invocade")
      //return imgSrc
      //  var image = document.createElement('img');
      //  image.src=imgSrc
      // document.querySelector('#best-seller-titles').append(image)
      // console.log(image)
    })
}


// fetch categories

var items = document.querySelectorAll("#dropdown li")

for (var i = 0; i < items.length; i++) {

  items[i].onclick = function getSelectValue() {

    // getSelectValue.preventDefault()
    document.querySelector("#show-books").style.display = "block";
    document.querySelector(".best").style.display = "none";
    document.getElementById("display-library").style.display = "none";
    document.querySelector(".welcome_to_your_library").style.display = "none";

    const bookDiv = document.getElementById("show-books");
    bookDiv.innerHTML = " ";
    var selectValue = this.innerText;
    document.getElementById("categories").innerText = selectValue;
    document.getElementById("categories").style.fontSize = "18px";
    document.getElementById("categories").style.textTransform = "uppercase";


    let category = {
      apikey: "AIzaSyAO9KsMIZQ2FpNeabxk7TJineYekfUh_jY",

      fetchBooksByCategory: function(subject) {
        fetch("https://www.googleapis.com/books/v1/volumes?q=subject:" +
          subject +
          "&langRestrict=" +
          localStorage.getItem("language") +
          "&printType=books&key=" +
          this.apikey)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            this.displayBooks(data)
          })
      },

      displayBooks: function(data) {

        data.items.forEach(d => {

          const { thumbnail } = d.volumeInfo.imageLinks;
          const { title } = d.volumeInfo;
          const author = d.volumeInfo.authors;
          const publisher = d.volumeInfo.publisher;
          const description = d.volumeInfo.description;
          const page_count = d.volumeInfo.pageCount;
          const isbn = d.volumeInfo.industryIdentifiers[0].identifier;

          // link to a new page with quering isbn
          let viewUrl = 'book.html?isbn=' + isbn;

          const result3 = document.createElement("div");
          result3.classList.add("entry");

          document.querySelector(".find_your_book").style.display = "block";

          // const find_your_book = document.createElement("h1");
          // find_your_book.textContent=`find your book!`
          // result3.appendChild(find_your_book);

          const bookCell = document.createElement("div");
          bookCell.classList.add("book-cell");
          result3.appendChild(bookCell);

          const bookImg = document.createElement("div");
          bookImg.classList.add("book-img");
          bookCell.appendChild(bookImg);

          const img = document.createElement("img");
          img.src = thumbnail;
          img.classList.add("book-photo");
          bookImg.appendChild(img);

          const bookContent = document.createElement("div");
          bookContent.classList.add("book-content");
          bookCell.appendChild(bookContent);

          // const saveButton = document.createElement("svg");
          // saveButton.classList.add("bi bi-bookmark");
          // saveButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          // saveButton.setAttribute("width", "16");
          // saveButton.setAttribute("height", "16");
          // saveButton.setAttribute("fill", "currentColor");
          // saveButton.setAttribute("viewBox", "0 0 16 16");
          // saveButton.innerHTML = `<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>`
          // bookContent.appendChild(saveButton);

          const saveButton = document.createElement("button");
          //   saveButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
          //   <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
          // </svg>`
          saveButton.classList.add("save_button");
          bookContent.appendChild(saveButton);

          const saveIcon = document.createElement("img");
          saveIcon.src = "images/saveButton.png";
          saveButton.appendChild(saveIcon);


          // favorites functionality
          saveButton.onclick = function saveFavorite() {

            const favorite = {

              thumbnail: thumbnail,
              title: title,
              author: author,
              publisher: publisher,
              description: description,
              isbn: isbn,
              viewUrl: viewUrl,

            }

            favorites.push(favorite);
            localStorage.setItem("favorites", JSON.stringify(favorites));

            alertAdded();
          }

          const titleElement = document.createElement("h2");
          titleElement.classList.add("book-title");
          titleElement.textContent = title;
          bookContent.appendChild(titleElement);

          const authorElement = document.createElement("h4");
          authorElement.classList.add("book-author");
          authorElement.textContent = `By ${author}`;
          bookContent.appendChild(authorElement);

          const publisherElement = document.createElement("h4");
          publisherElement.classList.add("publisher");
          publisherElement.textContent = `Publisher: ${publisher}`;
          bookContent.appendChild(publisherElement);

          const descriptionElement = document.createElement("p");
          descriptionElement.classList.add("book-sum");
          descriptionElement.textContent = description;
          bookContent.appendChild(descriptionElement);

          const see_more = document.createElement("a");
          see_more.setAttribute('target', '_blank');
          see_more.classList.add("book-see3");
          see_more.textContent = "Learn More";
          see_more.href = 'bookdetails.html?isbn=' + isbn;
          bookContent.appendChild(see_more);

          const hr = document.createElement("hr");
          bookContent.appendChild(hr);

          const link = document.createElement("a");
          link.setAttribute('target', '_blank');
          link.classList.add("book-see2");
          link.textContent = "Read Online";
          link.href = viewUrl;
          bookContent.appendChild(link);

          const open_book = document.createElement("img");
          open_book.classList.add("open-book");
          open_book.src = "images/open-book-logo.png";
          link.appendChild(open_book);


          const bookDiv = document.getElementById("show-books");
          bookDiv.appendChild(result3);


        })

      },
    }

    category.fetchBooksByCategory(selectValue)

  }
}


// fetch search

let search_input = document.querySelector("#search-input");
let search_button = document.getElementById("search-button");

let search = {
  apikey: "AIzaSyAO9KsMIZQ2FpNeabxk7TJineYekfUh_jY",
  fetchBooksBySearch: function(intitle) {
    fetch("https://www.googleapis.com/books/v1/volumes?q=:" + intitle + "&langRestrict=" +
      localStorage.getItem("language") +
      "&printType=books&key=" +
      this.apikey)
      .then(response =>
        response.json())
      .then(data => {
        console.log(data)
        this.displayBooks(data)
      })
  },

  displayBooks: function(data) {

    data.items.forEach(book => {

      const { thumbnail } = book.volumeInfo.imageLinks;
      const { title } = book.volumeInfo;
      const author = book.volumeInfo.authors;
      const publisher = book.volumeInfo.publisher;
      const description = book.volumeInfo.description;
      const page_count = book.volumeInfo.pageCount;
      const isbn = book.volumeInfo.industryIdentifiers[0].identifier;
      let viewUrl = 'book.html?isbn=' + isbn;

      const result3 = document.createElement("div");
      result3.classList.add("entry");

      // document.querySelector(".find_your_book").style.display = "block";

      // const find_your_book = document.createElement("h1");
      // find_your_book.textContent=`find your book!`
      // result3.appendChild(find_your_book);

      const bookCell = document.createElement("div");
      bookCell.classList.add("book-cell");
      result3.appendChild(bookCell);

      const bookImg = document.createElement("div");
      bookImg.classList.add("book-img");
      bookCell.appendChild(bookImg);

      const img = document.createElement("img");
      img.src = thumbnail;
      img.classList.add("book-photo");
      bookImg.appendChild(img);

      const bookContent = document.createElement("div");
      bookContent.classList.add("book-content");
      bookCell.appendChild(bookContent);

      const saveButton = document.createElement("button");
      saveButton.classList.add("save_button");
      bookContent.appendChild(saveButton);

      const saveIcon = document.createElement("img");
      // saveIcon.classList.add("save_button");
      saveIcon.src = "images/saveButton.png";
      saveButton.appendChild(saveIcon);


      //  const saveButton = document.createElement("i");
      // saveButton.classList.add("bi bi-bookmarks-fill");
      // bookContent.appendChild(saveButton);



      // favorites functionality

      saveButton.onclick = function saveFavorite() {

        const favorite = {

          thumbnail: thumbnail,
          title: title,
          author: author,
          publisher: publisher,
          description: description,
          isbn: isbn,
          viewUrl: viewUrl,

        }

        favorites.push(favorite);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        alertAdded();

        // document.querySelector(".find_your_book").style.display = "block";
        // display_Books();

      }

      document.querySelector(".find_your_book").style.display = "block";

      const titleElement = document.createElement("h2");
      titleElement.classList.add("book-title");
      titleElement.textContent = title;
      bookContent.appendChild(titleElement);

      const authorElement = document.createElement("h4");
      authorElement.classList.add("book-author");
      authorElement.textContent = `By ${author}`;
      bookContent.appendChild(authorElement);

      const publisherElement = document.createElement("h4");
      publisherElement.classList.add("publisher");
      publisherElement.textContent = `Publisher: ${publisher}`;
      bookContent.appendChild(publisherElement);

      const descriptionElement = document.createElement("p");
      descriptionElement.classList.add("book-sum");
      descriptionElement.textContent = description;
      bookContent.appendChild(descriptionElement);

      const see_more = document.createElement("a");
      see_more.setAttribute('target', '_blank');
      see_more.classList.add("book-see3");
      see_more.textContent = "Learn More";
      see_more.href = 'bookdetails.html?isbn=' + isbn;
      bookContent.appendChild(see_more);

      const hr = document.createElement("hr");
      bookContent.appendChild(hr);

      // const stats = document.createElement("div");
      // stats.classList.add("stats");
      // bookContent.appendChild(stats);

      // const pageCountElement = document.createElement("p");
      // pageCountElement.classList.add("page_count");
      // pageCountElement.textContent = `Page Count: ${page_count}`;
      // stats.appendChild(pageCountElement);

      const link = document.createElement("a");
      link.setAttribute('target', '_blank');
      link.classList.add("book-see2");
      link.textContent = "Read Online";
      link.href = viewUrl
      bookContent.appendChild(link);

      const open_book = document.createElement("img");
      open_book.classList.add("open-book");
      open_book.src = "images/open-book-logo.png";
      link.appendChild(open_book);


      const bookDiv = document.getElementById("show-books");
      bookDiv.appendChild(result3);

    })

  },
}



document.getElementById("search").addEventListener("submit", (e) => {

  e.preventDefault()

  document.querySelector("#show-books").style.display = "block";
  document.querySelector(".best").style.display = "none";
  document.getElementById("display-library").style.display = "none";
  const bookDiv = document.getElementById("show-books");
  bookDiv.innerHTML = " ";
  search.fetchBooksBySearch(document.querySelector("#search-input").value)

})


document.getElementById("logo").addEventListener("click", (e) => {

  document.querySelector(".best").style.display = "block";
  document.querySelector(".find_your_book").style.display = "none";
  document.querySelector("#show-books").style.display = "none";
  document.getElementById("display-library").style.display = "none";
})


// display books in my library section

function display_Books() {

  document.querySelector(".find_your_book").style.display = "none";
  document.querySelector(".welcome_to_your_library").style.display = "block";
  const bookList = document.querySelector("#library_books")
  bookList.innerHTML = ""

  favorites.forEach(book => {

    let viewUrl = 'book.html?isbn=' + book.isbn;

    const result3 = document.createElement("div");
    result3.classList.add("list-th");

    const bookCell = document.createElement("div");
    bookCell.classList.add("container");
    result3.appendChild(bookCell);

    const bookRead = document.createElement("div");
    bookRead.classList.add("book");
    bookCell.appendChild(bookRead);


    const imgDiv = document.createElement("div");
    imgDiv.classList.add("cover");
    bookRead.appendChild(imgDiv);

    const img = document.createElement("img");
    img.src = book.thumbnail;
    imgDiv.appendChild(img);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    bookRead.appendChild(descriptionDiv);


    const titleElement = document.createElement("h2");
    titleElement.classList.add("book-title");
    titleElement.textContent = book.title;
    descriptionDiv.appendChild(titleElement);

    const authorElement = document.createElement("h4");
    authorElement.classList.add("book-author");
    authorElement.textContent = `By ${book.author}`;
    descriptionDiv.appendChild(authorElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("book-sum");
    descriptionElement.textContent = book.description;
    descriptionDiv.appendChild(descriptionElement);

    const see_more = document.createElement("a");
    see_more.setAttribute('target', '_blank');
    see_more.classList.add("book-see3");
    see_more.textContent = "Learn More";
    see_more.href = 'bookdetails.html?isbn=' + book.isbn;
    descriptionDiv.appendChild(see_more);

    const hr = document.createElement("hr");
    bookRead.appendChild(hr);

    const link = document.createElement("a");
    link.setAttribute('target', '_blank');
    link.classList.add("book-see2");
    link.textContent = "Read Online";
    link.href = viewUrl;
    bookRead.appendChild(link);

    const open_book = document.createElement("img");
    open_book.classList.add("open-book");
    open_book.src = "images/open-book-logo.png";
    link.appendChild(open_book);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    width="32" height="32"
    viewBox="0,0,256,256"
    style="fill:#000000;">
    <g fill="#b92d5d" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8,8)"><path d="M15,4c-0.52344,0 -1.05859,0.18359 -1.4375,0.5625c-0.37891,0.37891 -0.5625,0.91406 -0.5625,1.4375v1h-6v2h1v16c0,1.64453 1.35547,3 3,3h12c1.64453,0 3,-1.35547 3,-3v-16h1v-2h-6v-1c0,-0.52344 -0.18359,-1.05859 -0.5625,-1.4375c-0.37891,-0.37891 -0.91406,-0.5625 -1.4375,-0.5625zM15,6h4v1h-4zM10,9h14v16c0,0.55469 -0.44531,1 -1,1h-12c-0.55469,0 -1,-0.44531 -1,-1zM12,12v11h2v-11zM16,12v11h2v-11zM20,12v11h2v-11z"></path></g></g>
    </svg>`;
    bookRead.appendChild(deleteButton);


    deleteButton.addEventListener("click", e => {

      alert("This book has been removed from your library!")
      favorites = favorites.filter(fav => fav != book)
      localStorage.setItem("favorites", JSON.stringify(favorites));
      display_Books();
    })

    bookList.appendChild(result3);

  })
}


function display_bestSellers() {

  document.querySelector(".find_your_book").style.display = "none";
  document.querySelector(".welcome_to_your_library").style.display = "block";
  const bookListSellers = document.querySelector("#library_books_sellers")
  bookListSellers.innerHTML = ""

  bestSellersfavorites.forEach(book => {

    const result3 = document.createElement("div");
    result3.classList.add("list-th");

    const bookCell = document.createElement("div");
    bookCell.classList.add("container");
    result3.appendChild(bookCell);

    const bookRead = document.createElement("div");
    bookRead.classList.add("book");
    bookCell.appendChild(bookRead);

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("cover");
    bookRead.appendChild(imgDiv);

    const img = document.createElement("img");
    img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/387928/book%20placeholder.png";
    img.setAttribute('id', "cover-" + book.rank);
    // console.log(book.rank)
    imgDiv.appendChild(img);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    bookRead.appendChild(descriptionDiv);

    const titleElement = document.createElement("h2");
    titleElement.classList.add("book-title");
    titleElement.textContent = book.bookInfo.title;
    descriptionDiv.appendChild(titleElement);

    const authorElement = document.createElement("h4");
    authorElement.classList.add("book-author");
    authorElement.textContent = `By ${book.bookInfo.author}`;
    descriptionDiv.appendChild(authorElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("book-sum");
    descriptionElement.textContent = book.bookInfo.description;
    descriptionDiv.appendChild(descriptionElement);

    const hr = document.createElement("hr");
    bookRead.appendChild(hr);

    const stats = document.createElement("div");
    stats.classList.add("stats");
    bookRead.appendChild(stats);

    const lastWeek = document.createElement("p");
    lastWeek.textContent = `Last Week:  ${book.lastWeekRank} `;
    stats.appendChild(lastWeek);

    const weekdOnList = document.createElement("p");
    weekdOnList.textContent = `Weeks on list:  ${book.weeksOnList} `;
    stats.appendChild(weekdOnList);


    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    width="32" height="32"
    viewBox="0,0,256,256"
    style="fill:#000000;">
    <g fill="#b92d5d" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8,8)"><path d="M15,4c-0.52344,0 -1.05859,0.18359 -1.4375,0.5625c-0.37891,0.37891 -0.5625,0.91406 -0.5625,1.4375v1h-6v2h1v16c0,1.64453 1.35547,3 3,3h12c1.64453,0 3,-1.35547 3,-3v-16h1v-2h-6v-1c0,-0.52344 -0.18359,-1.05859 -0.5625,-1.4375c-0.37891,-0.37891 -0.91406,-0.5625 -1.4375,-0.5625zM15,6h4v1h-4zM10,9h14v16c0,0.55469 -0.44531,1 -1,1h-12c-0.55469,0 -1,-0.44531 -1,-1zM12,12v11h2v-11zM16,12v11h2v-11zM20,12v11h2v-11z"></path></g></g>
    </svg>`;
    bookRead.appendChild(deleteButton);


    deleteButton.addEventListener("click", e => {

      alert("This book has been removed from your library!")
      bestSellersfavorites = bestSellersfavorites.filter(fav => fav != book)
      localStorage.setItem("bestSellersfavorites", JSON.stringify(bestSellersfavorites));
      display_bestSellers();
    })




    bookListSellers.appendChild(result3);
    updateCover(book.rank, book.isbn);

    console.log("hiiiiii")




  })
}




document.getElementById("my_library").addEventListener("click", (e) => {
  e.preventDefault()
  document.getElementById("display-library").style.display = "block";
  document.querySelector(".best").style.display = "none";
  document.querySelector("#show-books").style.display = "none";
  display_Books();
  display_bestSellers();
})

document.getElementById("best_sellers_style").addEventListener("click", (e) => {
  e.preventDefault()
  document.querySelector(".best").style.display = "block";
  document.getElementById("display-library").style.display = "none";
  document.querySelector("#show-books").style.display = "none";
  document.querySelector(".find_your_book").style.display = "none";
})

document.getElementById("display-library").style.display = "none";
document.querySelector(".find_your_book").style.display = "none";
document.querySelector(".welcome_to_your_library").style.display = "none";


function alertAdded() {
  alert("This book has been added to your library!")
};


// if (favorites == []){
//   alert("Your library is empty!")
// };