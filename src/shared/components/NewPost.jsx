import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export const NewPost = ({ image }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);

  const imgRef = useRef();
  const canvasRef = useRef();
  const croppedCanvasRef = useRef();

  const handleImage = async () => {
    // Pass img to model
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    setFaces(detections.map((d) => Object.values(d.box)));
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        // faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);

      imgRef.current && handleImage();
    };

    loadModels();
  }, []);

  useEffect(() => {
    const enter = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'blue';
        faces.map((face) => ctx.strokeRect(...face));
      }
    };

    const drawCropped = () => {
      if (faces.length > 0) {
        const [x, y, w, h] = faces[0];
        const img = imgRef.current;
        const canvas = croppedCanvasRef.current;
        const ctx = canvas.getContext('2d');
    
        // redimensiona a imagem original para a resolução máxima necessária
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
        const newWidth = Math.floor(w * ratio);
        const newHeight = Math.floor(h * ratio);
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, x - 20 , y - 120, w + 60 , h + 160, 0, 0, newWidth, newHeight);
    
        // converte a nova imagem em um objeto Image com várias resoluções
        const blobUrl = canvas.toDataURL();
        const srcset = `${blobUrl} 1x, ${blobUrl.replace(
          'data:image/png',
          'data:image/png 2x'
        )} 2x`;
        setFriends((prev) => ({ ...prev, face: { blobUrl, srcset } }));
      }
    };
    

    enter();
    drawCropped();
  }, [faces]);

  return (
    <div className="container">
          <div className={friends.face ? "left hidden" : "left"} style={{ width, height, display: friends.face ? "none" : "block" }}>
            <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />

            <canvas ref={canvasRef} width={width} height={height}></canvas>

            <canvas ref={croppedCanvasRef} style={{ display: 'none' }}></canvas>
          </div>

      {friends.face ? (
        <img
          src={friends.face.blobUrl}
          alt=""
          srcSet={friends.face.srcset}
          style={{ width, height }}
        />
      ) : (
        <p>Sem rosto detectado</p>
      )}
    </div>
  );

  


};
