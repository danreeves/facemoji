import getImages from './load-images';

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && 'FaceDetector' in window) {
  const images = getImages();
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { width: 640, height: 480 } })
    .then(function(stream) {
      const videoEl = document.querySelector('video');
      const canvasEl = document.querySelector('canvas');
      const canvasCtx = canvasEl.getContext('2d');
      const videoStream = stream.getTracks()[0];
      const faceDetector = new window.FaceDetector();
    
      function drawFaces () {
          faceDetector.detect(videoEl)
            .then(faces => {
                canvasCtx.clearRect(0, 0, 640, 480);
                faces.forEach(face=> {
                    const eyeWidth = face.boundingBox.width / 3.5;
                    const eyeHeight = 128 * (eyeWidth / 128);
                    const mouthWidth = face.boundingBox.width / 2;
                    const mouthHeight = 128 * (mouthWidth / 128);
                    face.landmarks.forEach(landmark => {
                      if (landmark.type === 'eye') {
                        canvasCtx.drawImage(
                          images.eye, 
                          landmark.location.x - (eyeHeight / 2), 
                          landmark.location.y - (eyeWidth / 2), 
                          eyeWidth, 
                          eyeHeight
                        );
                      }
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
                drawFaces();
            })
            .catch(err => {
              console.error("Boo, Face Detection failed: " + err);
            });
      }
    
      videoEl.src = window.URL.createObjectURL(stream);
      videoEl.play();
      setTimeout(() => drawFaces(), 1000); // TODO: how can we do this better?
    
    }).catch(function(err) {
      console.error('Failed to get webcam', err)
    });
}