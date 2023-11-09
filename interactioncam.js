//interactioncam.js - grab a pic
(function() {

    var data;
    var dataURL;
  
    var streaming = false,
        video        = document.querySelector('#video'),
        cover        = document.querySelector('#cover'),
        canvas       = document.querySelector('#canvas'),
        photo        = document.querySelector('#photo'),
        startbutton  = document.querySelector('#startbutton'),
        width = 320,
        height = 240;
  
    navigator.getMedia = ( navigator.getUserMedia || 
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);
  
    navigator.getMedia(
      { 
        video: true, 
        audio: false 
      },
      function(stream) {
        if (navigator.mozGetUserMedia) { 
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );
  
    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);
  
    function takepicture() {
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(video, 0, 0, width, height);
      var data = canvas.toDataURL('image/png');
      var dataURL = canvas.toDataURL();
      photo.setAttribute('src', data);
    };
  
    startbutton.addEventListener('click', function(ev){
        takepicture();
      ev.preventDefault();
    }, false);
  
    // Convert DataURL to Blob object
    function dataURLtoBlob(dataURL) {
      // Decode the dataURL
      var dataURL = canvas.toDataURL();    
      var binary = atob(dataURL.split(',')[1]);
      // Create 8-bit unsigned array
      var array = [];
      for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      // Return our Blob object
      return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }
  
    // Send IT
    $("#upCanvas").live("click", function(){
      $("#upCanvas").html("<img src='img/load.gif' alt='load'>&nbsp;&nbsp;&nbsp;Uploading ..");
      // Convert Canvas DataURL
      var dataURL= canvas.toDataURL();
  
      // Get Our File
      var file= dataURLtoBlob(dataURL);
  
      // Create new form data
      var fd = new FormData();
  
      // Append our image
      fd.append("imageNameHere", file);
  
      $.ajax({
         url: "uploadFile.php",
         type: "POST",
         data: fd,
         processData: false,
         contentType: false,
      }).done(function(respond){
        $("#upCanvas").html("Upload This Canvas");
          $(".return-data").html("Uploaded Canvas image link: <a href="+respond+">"+respond+"</a>").hide().fadeIn("fast");
      });
    });
  
  })();