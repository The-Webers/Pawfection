function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function addProduct() {
    var logUser = localStorage.getItem("currentUser");
    var proName = document.getElementById('proName').value
    var proDes = document.getElementById('proDes').value
    var proPrice = document.getElementById('proPrice').value
    var proCateg = document.getElementById('proCateg')
    var proCity = document.getElementById('proCity')
    var img = document.getElementById('proImg').files[0];
    var productError = document.getElementById('productError')
    productError.innerHTML = ""
    if (!proName || !proDes || !proPrice || proCateg.selectedIndex === 0 || proCity.selectedIndex === 0 || !img) {
        return productError.innerHTML = "Please Fill Form Properly"
    }

    uploadImage(logUser, proName, proDes, proPrice, proCateg, proCity, img)
}

function uploadImage(logUser, proName, proDes, proPrice, proCateg, proCity, img) {
    var imageName = img.name;
    var storageRef = firebase.storage().ref('images/' + imageName);
    var uploadTask = storageRef.put(img)

    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + " done")
    }, function (error) {
        console.log(error.message)
    }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            var imgURL = downloadURL
            uploadProduct(imgURL, logUser, proName, proDes, proPrice, proCateg, proCity)
            resetValues()
        })
    })
}

function uploadProduct(imgURL, logUser, proName, proDes, proPrice, proCateg, proCity) {
    // console.log("Hello")
    let database = firebase.database().ref('posts');
    let key = database.push().key;
    let post = {
        imgURL: imgURL,
        userId: logUser,
        proName: proName,
        proDes: proDes,
        proPrice: proPrice,
        proCateg: proCateg.value,
        proCity: proCity.value,
        postId: key,        
    }
    database.child(key).set(post)
    alert("Post Created Successfully")
    // location.replace("../loginUser/my ads.html")
}

function resetValues(){
    document.getElementById('proName').value = ""
    document.getElementById('proDes').value = ""
    document.getElementById('proPrice').value = ""
    document.getElementById('proCateg').selectedIndex = 0
    document.getElementById('proCity').selectedIndex = 0
    //document.getElementById('proImg') = ""   
}


function showCats(){
    console.log("yes")
    let promise = new Promise(function (resolve, reject) {
        firebase.database().ref('posts').on('value', function (data) {
            if (data.val()) {
                //console.log("accept")
                resolve(data.val())
                
            } else {
                console.log("reject")
                reject("Something went wrong")
            }
        })
    })

    promise.then(function (data) {
        console.log("yes")
        console.log(data)
        prepareCats(data)
             console.log("Check =>", check)
            addUser(check)
        })

        .catch(function (error) {
            console.log(error)
            // pushData()
        })    
}

function prepareCats(d) {
    console.log("yes")
    var userPosts = d
    var postId = [];
    for (var key in userPosts) {
         console.log(key)
        //postId.push(key)
        postId.splice(0,0,key)
    }
    console.log(postId)
    for (var i = 0; i < postId.length; i++) {
        var price = userPosts[postId[i]].proPrice
        var description = userPosts[postId[i]].proDes
        var location = userPosts[postId[i]].proCity
        var image = userPosts[postId[i]].imgURL
        var pid = userPosts[postId[i]].postId
        if(userPosts[postId[i]].proCateg == "Cats"){
            renderCats(price, description, location, image, pid)
        }
    }
}

function renderCats(price, description, location, image, pid){
    var productContainer = document.getElementById('productContainer')
    var product = `<div class="col-3 my-3">
        <div class="card" style="width: 18rem;">
            <img class="card-img-top product_image" src=${image}>
            <div class="card-body">
              <h5 class="card-title">Rs ${price}</h5>
              <small class="card-text" id="pid" style="visibility:hidden">${pid}</small>
              <p class="card-text">${description}</p>
              <p class="card-text">${location}</p>
            </div>
          </div>
        </div>`
        productContainer.innerHTML += product
    } 
// End of Show Cats =============================================>   

// Start of Show Dogs ===============================================>
function showDogs(){
    let promise = new Promise(function (resolve, reject) {
        firebase.database().ref('posts').on('value', function (data) {
            if (data.val()) {
                resolve(data.val())
            } else {
                reject("Something went wrong")
            }
        })
    })

    promise.then(function (data) {
        // console.log(data)
        prepareDogs(data)
            // console.log("Check =>", check)
            // addUser(check)
        })

        .catch(function (error) {
            console.log(error)
            // pushData()
        })    
}

function prepareDogs(d) {
    var userPosts = d
    var postId = [];
    for (var key in userPosts) {
        // console.log(key)
        // postId.push(key)
        postId.splice(0,0,key)
    }
    // console.log(postId)
    for (var i = 0; i < postId.length; i++) {
        var price = userPosts[postId[i]].proPrice
        var description = userPosts[postId[i]].proDes
        var location = userPosts[postId[i]].proCity
        var image = userPosts[postId[i]].imgURL
        var pid = userPosts[postId[i]].postId
        if(userPosts[postId[i]].proCateg == "Dogs"){
            renderDogs(price, description, location, image, pid)
        }
    }
}

function renderDogs(price, description, location, image, pid){
    var productContainer = document.getElementById('productContainer')
    var product = `<div class="col-3 my-3">
        <div class="card" style="width: 18rem;">
            <img class="card-img-top product_image" src=${image}>
            <div class="card-body">
              <h5 class="card-title">Rs ${price}</h5>
              <small class="card-text" id="pid" style="visibility:hidden">${pid}</small>
              <p class="card-text">${description}</p>
              <p class="card-text">${location}</p>
            </div>
          </div>
        </div>`
        productContainer.innerHTML += product
    } 
// End of Show Dogs =============================================> 

