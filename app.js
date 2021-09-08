class Book
{
    constructor(title,author,isbn)
    {
        this.title=title;
        this.author = author;
        this.isbn= isbn;
    }
}
// class UI : Handle UI task
class UI
{
    static dispalyBooks()
    {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book)
    {
        const list = document.querySelector("#book-list");  //selecting the table body tag using id = #book-list
        const row = document.createElement("tr");           // Creteed a <tr></tr>
        row.innerHTML = 
        `<td>${book.title}</td>         
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> <a href="#" class= "btn btn-danger btn-sm delete"> X </a></td>
        `;
        list.appendChild(row);                              // adding the newly created <tr></tr> to the <tbody></tbody>
    }
    static deleteBook(el)
    {   
        if(el.classList.contains("delete"))
            el.parentElement.parentElement.remove();
    }
    static showAlert(message, className)
    {
        const div = document.createElement("div");          //Creating a <div></div>
        div.className = `alert alert-${className}`;         //Adding class = "alert alert-classname" to div tag
        const text = document.createTextNode(message);      // Created a Text message 
        div.appendChild(text);                              //Inserted the text message inside the div tag

        const container = document.querySelector(".container");     //selecting container class
        const form = document.querySelector("#book-form");          // seelcting the form tag using id=#book-form
        /*
        insertbefor(1st parameter,2nd parameter)
        1st parameter takes the element to be inserted
        2nd parameter takes the element before which the element stated in 1st parameter to be inserted
        */
        container.insertBefore(div,form);       //inserted the div tag before form
        //Vanish In 3 sec
        setTimeout(()=>document.querySelector(".alert").remove(),1000);
        //https://www.wx3schools.com/js/js_arrow_function.asp
    }
    static clearFeilds()
    {
        document.querySelector("#title").value="";
        document.querySelector("#author").value="";
        document.querySelector("#isbn").value="";
    }
}

// Store Class : Handles Storage
class Store
{
    static getBooks()
    {
        let books;       //https://www.w3schools.com/js/js_let.asp
        if(localStorage.getItem("books")===null)    // https://www.w3schools.com/jsref/met_storage_getitem.asp
            books= [];
        else
            books =  JSON.parse(localStorage.getItem("books"));             //https://www.w3schools.com/js/js_json_parse.asp
            //https://www.w3schools.com/jsref/met_storage_getitem.asp
        return books;
    }
    static addBooks(book)
    {
        const books = Store.getBooks();
        books.push(book);
        //https://www.w3schools.com/jsref/met_storage_setitem.asp
        localStorage.setItem("books",JSON.stringify(books));             //https://www.w3schools.com/js/js_json_stringify.asp
    }
    static removeBook(isbn)
    {
        const books = Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn)
                books.splice(index,1);
        });
        //https://www.w3schools.com/jsref/jsref_slice_array.asp        https://www.w3schools.com/jsref/jsref_splice.asp
        localStorage.setItem("books",JSON.stringify(books));
    }
}

// Event: Display Books   https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener('DOMContentLoaded' ,UI.dispalyBooks);

// Event: Add a Books
document.querySelector("#book-form").addEventListener("submit",(e)=> { 
    // Prevent actual submit               https://www.w3schools.com/jsref/event_preventdefault.asp
    e.preventDefault();

    // Get form Values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate that all the feild have been entered
    if(title===""||author==="" || isbn==="")
        UI.showAlert("Please fill all the fields","danger")
    else
    {
        // Instantiate Book
        const book = new Book(title,author,isbn);
        // Add book to UI
        UI.addBookToList(book);
        // Add book to store
        Store.addBooks(book);
        // Show the Success message
        UI.showAlert("Book added","success");
        // clear feilds
        UI.clearFeilds();
    }
})
// Event: Remove a Books
document.querySelector("#book-list").addEventListener("click",(e)=>
{
    // Remove Book from UI
    UI.deleteBook(e.target);
    // remove Book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show the Success message
    UI.showAlert("Book Removed","success");
})