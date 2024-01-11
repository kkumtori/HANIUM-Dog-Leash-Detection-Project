console.log(navigator.userAgent);

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
      });
  }
}

// CAM 연결
const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
});
function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('camera-image', blob);
        fetch('/test/', {
            method: 'POST',
            body: formData
        });
    });
}

window.addEventListener('DOMContentLoaded', function()
{
    var iconbell = document.querySelector('.bell');
    const belltext = document.querySelector('.new');

    let str_num = belltext.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let bellnumber = parseInt(result);
    if (bellnumber!= 0 && bellnumber > 0){
        iconbell.src = '../../static/images/alarmicon.svg';
    }else{
        iconbell.src = '../../static/images/bell.svg';
    }
});

// CAM 선택시 확대되는 코드
// document.addEventListener("DOMContentLoaded", function() {
//   const camDivs = document.querySelectorAll('[class*="cam_box"]');
//   camDivs.forEach(function(camDiv) {
//     camDiv.addEventListener("click", function() {
//       if (camDiv.classList.contains("active")) {
//         camDiv.classList.remove("active");
//         camDivs.forEach(function(otherCamDiv) {
//           otherCamDiv.style.opacity = "1";
//         });
//       } else {
//         camDivs.forEach(function(otherCamDiv) {
//           if (otherCamDiv === camDiv) {
//             camDiv.classList.add("active");
//           } else {
//             otherCamDiv.style.opacity = "0";
//           }
//         });
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
  const camDivs = document.querySelectorAll('[class*="cam_box"]');
  camDivs.forEach(function(camDiv) {
    camDiv.addEventListener("click", function() {
      if (camDiv.classList.contains("active")) {
        camDiv.classList.remove("active");
        camDivs.forEach(function(otherCamDiv) {
          otherCamDiv.style.opacity = "1";
        });
      } else {
        camDivs.forEach(otherCamDiv => {
          if (otherCamDiv === camDiv) {
            camDiv.classList.add("active");
          } else {
            otherCamDiv.style.opacity = "0";
          }
        });
      }
    });
  });
});
// + 활성시 다른 click event 막아놔야함

 
