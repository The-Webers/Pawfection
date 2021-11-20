function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  
  
  function addProduct() {
    var logUser = localStorage.getItem("currentUser");
    var parFName=document.getElementById('fname').value
    var parLName=document.getElementById('lname').value
    var email = document.getElementById('email').value
    var contact = document.getElementById('contact').value
    var petCateg = document.getElementById('petCateg')
    var petName = document.getElementById('petName').value
    var petAge = document.getElementById('petAge').value
    var petBreed = document.getElementById('petBreed').value
    var petLoc = document.getElementById('petLoc').value
    var petDes = document.getElementById('petDes').value
    var img = document.getElementById('petImg').files[0];
    var petError = document.getElementById('petError')
    petError.innerHTML = ""
    if (!parFName ||!parLName || !email || !contact || !petDes || !petAge ||!petName ||!petBreed ||petCateg.selectedIndex === 0 ||!petLoc || !img) {
        return petError.innerHTML = "Please Fill Form Properly"
    }

    uploadImage(logUser,parFName, parLName, email, contact, petDes, petAge, petName, petBreed, petCateg, petLoc, img)
}

function uploadImage(logUser,parFName, parLName, email, contact, petDes, petAge, petName, petBreed, petCateg, petLoc, img) {
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
            uploadProduct(imgURL, logUser,parFName, parLName, email, contact, petDes, petAge, petName, petBreed, petCateg, petLoc)
            resetValues()
        })
    })
}

function uploadProduct(imgURL, logUser,parFName, parLName, email, contact, petDes, petAge, petName, petBreed, petCateg, petLoc) {
    // console.log("Hello")
    let database = firebase.database().ref('posts');
    let key = database.push().key;
    let post = {
        imgURL: imgURL,
        userId: logUser,
        parName:parFName+" "+parLName,
        Email:email,
        Contact:contact,
        petName: petName,
        petDes: petDes,
        petAge: petAge,
        petBreed:petBreed,
        petCateg: petCateg.value,
        petLoc: petLoc,
        postId: key,        
    }
    database.child(key).set(post)
    alert("Post Created Successfully")
    // location.replace("../loginUser/my ads.html")
}

function resetValues(){  
    document.getElementById('fname').value= ""
    document.getElementById('lname').value= ""
    document.getElementById('email').value= ""
    document.getElementById('contact').value= ""
    document.getElementById('petCateg').selectedIndex = 0
    document.getElementById('petName').value= ""
    document.getElementById('petAge').value= ""
    document.getElementById('petBreed').value= ""
    document.getElementById('petLoc').value= ""
    document.getElementById('petDes').value= ""
    //document.getElementById('petImg')=null 
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
        var Parname=userPosts[postId[i]].parName
        var Email=userPosts[postId[i]].Email
        var Contact=userPosts[postId[i]].Contact
        var Name=userPosts[postId[i]].petName
        var Age= userPosts[postId[i]].petAge
        var Breed=userPosts[postId[i]].petBreed
        var description = userPosts[postId[i]].petDes
        var location = userPosts[postId[i]].petLoc
        var image = userPosts[postId[i]].imgURL
        var pid = userPosts[postId[i]].postId
        if(userPosts[postId[i]].petCateg == "Cats"){
         renderCats(Name,Breed,Age, description,Parname, location,Email,Contact, image, pid)
              }
    }
}

function renderCats(Name,Breed,Age, description,Parname, location,Email,Contact, image, pid){
    var productContainer = document.getElementById('productContainer')
    var product = `<div class="pricing-column col-lg-4 col-md-6">
    <div class="card">
        <div class="card-body">
        <img class="card-img-top product_image" src=${image}>
        </div>
        <div class="card-body">
          <b><h3 class="card-title" style="color:green; font-weight: bolder;"> ${Name}</h3></b>
          </div>
          <div class="card-footer">
          <h5 style=" font-weight: bolder;"> ${Breed}</h5>
          </div>
          <div class="card-footer">
          <h6 style=" font-weight: bold;">Age: ${Age}</h6>
          </div>
          <div class="card-footer">
          <p style=" font-weight: bold; class="card-text">${description}</p>
          </div>
          <div class="card-footer">
          <p class="card-text">📍${location}</p>
          </div>
          <div class="card-footer">
          <div style="width: 100%;">
    <div style="width: 50%; float: left;"> 
    📧 <br><a href = "mailto:${Email} style="align:left;">Send Email</a>
    </div>
    <div style="margin-left: 50%;"> 
    📞<a href="tel:${Contact}" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});"><p class="call-button">Click to Call</p></a>
    </div>
    Owner: <h6 style=" font-weight: bolder;">${Parname}</h6>
    <small class="card-text" id="pid" style="visibility:hidden">${pid}</small>
    </div>

    </div>`
        productContainer.innerHTML += product
    } 
 
// End of Show Cats =============================================>   

// // Start of Show Dogs ===============================================>
function showDogs(){
    console.log("yes")
    let promise = new Promise(function (resolve, reject) {
        firebase.database().ref('posts').on('value', function (data) {
            if (data.val()) {
                //console.log("accept")
                resolve(data.val())
                
            } else {
                //console.log("reject")
                reject("Something went wrong")
            }
        })
    })

    promise.then(function (data) {
        //console.log("yes")
        //console.log(data)
        prepareDogs(data)
             console.log("Check =>", check)
            addUser(check)
        })

        .catch(function (error) {
            //console.log(error)
            // pushData()
        })    
}

function prepareDogs(d) {
    //console.log("yes")
    var userPosts = d
    var postId = [];
    for (var key in userPosts) {
         console.log(key)
        //postId.push(key)
        postId.splice(0,0,key)
    }
    console.log(postId)
    for (var i = 0; i < postId.length; i++) {
        var Parname=userPosts[postId[i]].parName
        var Email=userPosts[postId[i]].Email
        var Contact=userPosts[postId[i]].Contact
        var Name=userPosts[postId[i]].petName
        var Age= userPosts[postId[i]].petAge
        var Breed=userPosts[postId[i]].petBreed
        var description = userPosts[postId[i]].petDes
        var location = userPosts[postId[i]].petLoc
        var image = userPosts[postId[i]].imgURL
        var pid = userPosts[postId[i]].postId
        if(userPosts[postId[i]].petCateg == "Dogs"){
         renderDogs(Name,Breed,Age, description,Parname, location,Email,Contact, image, pid)
              }
    }
}

function renderDogs(Name,Breed,Age, description,Parname, location,Email,Contact, image, pid){
    var productContainer = document.getElementById('productContainer')
    var product = `<div class="pricing-column col-lg-4 col-md-6">
    <div class="card">
        <div class="card-body">
        <img class="card-img-top product_image" src=${image}>
        </div>
        <div class="card-body">
          <b><h3 class="card-title" style="color:green; font-weight: bolder;"> ${Name}</h3></b>
          </div>
          <div class="card-footer">
          <h5 style=" font-weight: bolder;"> ${Breed}</h5>
          </div>
          <div class="card-footer">
          <h6 style=" font-weight: bold;">Age: ${Age}</h6>
          </div>
          <div class="card-footer">
          <p style=" font-weight: bold; class="card-text">${description}</p>
          </div>
          <div class="card-footer">
          <p class="card-text">📍${location}</p>
          </div>
          <div class="card-footer">
          <div style="width: 100%;">
    <div style="width: 50%; float: left;"> 
    📧 <br><a href = "mailto:${Email} style="align:left;">Send Email</a>
    </div>
    <div style="margin-left: 50%;"> 
    📞<a href="tel:${Contact}" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});"><p class="call-button">Click to Call</p></a>
    </div>
    Owner: <h6 style=" font-weight: bolder;">${Parname}</h6>
    <small class="card-text" id="pid" style="visibility:hidden">${pid}</small>
    </div>

    </div>`
        productContainer.innerHTML += product
    } 
// End of Show Dogs =============================================> 

