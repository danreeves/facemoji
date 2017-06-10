import getImages from './load-images';

// This is a feature detection
// It makes sure we have the navigator.mediaDevices.getUserMedia 
// and window.FaceDetector APIs before we try to use them
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && 'FaceDetector' in window) {
  
  // This function creates some image elements for use to draw onto the canvas
  const images = getImages();
  
  // Ask the user if we can use their webcam
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { width: 640, height: 480 } })
    .then(function(stream) {
      // We've got the users webcam so now we can set up 
      // streaming that to the video element
    
      // Get the video element from the DOM
      const videoEl = document.querySelector('video');
      // Get the canvas from the DOM      
      const canvasEl = document.querySelector('canvas');
      // Get a 2D context for the canvas with a transparent background
      const canvasCtx = canvasEl.getContext('2d', { alpha: true });
      // Get the individual video stream from the usermedia
      const videoStream = stream.getTracks()[0];
      // Create a FaceDetector instance
      const faceDetector = new window.FaceDetector();
      
      // Set the video element source to a URL that references the stream from the webcam
      // It'll look something like blob:https://facemoji.glitch.me/76646a4f-6b46-4c84-866a-73d3cb6359ad
      videoEl.src = window.URL.createObjectURL(stream);
      // Start playing the video element
      videoEl.play();
      // Here we're waiting a second for the video element to buffer and start playing
      // If we don't do this the faceDetector api could get a video element without
      // a video source and fail
      setTimeout(() => drawFaces(), 1000); // TODO: how can I do this better?
    

      function drawFaces () {
          // Pass the video element into faceDetector.detect()
          // It can also take Image, SVG, and Canvas elements
          faceDetector.detect(videoEl)
            .then(faces => {
                // We've been given an array of faces
                
                // Let's clear the old emojis from the canvas
                canvasCtx.clearRect(0, 0, 640, 480);
            
                // Loop through all the faces
                // Each face has a boundingBox object with coordinates and dimensions
                faces.forEach(face=> {
                    // We're making the eye emoji a little less than a 3rd of the width of the face    
                    const eyeWidth = face.boundingBox.width / 3.5;
                    // This resizes the height of the eye emoji keeping the original width/height ratio
                    // 128 is just the original size of the image                  
                    const eyeHeight = 128 * (eyeWidth / 128);
                    // The mouth is half the width of the face
                    const mouthWidth = face.boundingBox.width / 2;
                    const mouthHeight = 128 * (mouthWidth / 128);
                  
                    // Loop through the "landmarks" detected on a face
                    // It can spot eyes and mouths
                    face.landmarks.forEach(landmark => {
                      // Draw the correct emoji for the landmark type
                      // x and y coordinates are offset by half the width or height
                      // of the image because the landmark location is the centre whereas
                      // images are drawn from the top left corner
                      if (landmark.type === 'eye') {
                        canvasCtx.drawImage(
                          images.eye,
                          landmark.location.x - (eyeHeight / 2),
                          landmark.location.y - (eyeWidth / 2), 
                          eyeWidth, 
                          eyeHeight
                        );
                      }
                      // Same as above
                      if (landmark.type === 'mouth') {
                        canvasCtx.drawImage(
                          images.mouth, 
                          landmark.location.x - (mouthWidth / 2), 
                          landmark.location.y - (mouthHeight / 2), 
                          mouthWidth, 
                          mouthHeight
                        );
                      }
                    });
                });
                // We've finished so lets call the function again
                drawFaces();
            })
            .catch(err => {
              console.error("Boo, Face Detection failed: " + err);
              doesntWork();
            });
      }
    
    }).catch(function(err) {
      console.error('Failed to get webcam', err);
      doesntWork();
    });
} else {
  doesntWork();
}

function doesntWork() {
  document.querySelector('video').remove();
  document.querySelector('canvas').remove();
}