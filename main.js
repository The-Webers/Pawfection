
var ImgName,Imgurl;
var files=[];
var reader;
const firebaseConfig = {
    apiKey: "AIzaSyCz1xVfgT4Zc_Ue_mv4ilXedXgm7dKlWRg",
    authDomain: "pawfection-9937f.firebaseapp.com",
    projectId: "pawfection-9937f",
    storageBucket: "pawfection-9937f.appspot.com",
    messagingSenderId: "478460032669",
    appId: "1:478460032669:web:e4ef4849e491a6ea130674",
    measurementId: "G-37M2FDW4V4"
  };
  firebase.initializeApp(firebaseConfig);
  document.getElementById("formFile").onclick=function(e){
      var input=document.createElement('input');
      input.click();

    //   input.onchange=e=>{
    //       files=e.target.files;
    //       reader=new FileReader();
    //       reader.onload=function(){
    //           document.getElementById("myimg").src=reader.result;
    //       }
    //      reader.readAsDataURL(files[0]);
    //   }
    //   input.click();

  }
  document.getElementById("submit").onclick=function(){

      /*ImgName=document.getElementById('petName').value;
      console.log(ImgName);
      var uploadTask= firebase.storage().ref('Images/'+ImgName+".png").putString(files[0]);
      console.log(uploadTask);
      uploadTask.on('state_changed',function(snapshot){
          var progress=(snapshot.bytesTransferred/snapshot.totaBytes)*100;
          document.getElementById("UpProgress").innerHTML='Upload'+progress+'%';
      },
      //Error handling
      function(error){
            alert('error in saving the image');
      },
      //Submit image link to DB
      function(){
          uploadTask.snapshot.ref.getDownloadURL().then(function(url){
              Imgurl=url;
    
          firebase.database().ref('Pictures/'+ImgName).set({
              Name:ImgName,
              Link:Imgurl
          });
      }
      );
    });*/

    var type = getInputVal('types');
     var storage = firebase.storage();
     var file=document.getElementById("formFiles").files[0];
     var storageref=storage.ref();
     var thisref=storageref.child(type).child(file.name).put(file);
     thisref.on('state_changed',function(snapshot) {
    
    
     }, function(error) {
     
    }, function() {
     // Uploaded completed successfully, now we can get the download URL
     thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
       //getting url of image
       document.getElementById("url").value=downloadURL;
       alert('uploaded successfully');
       saveMessage(downloadURL);
      });
     });
  }