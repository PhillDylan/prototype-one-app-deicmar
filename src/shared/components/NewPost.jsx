import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export const NewPost = ({ image }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    // Pass img to model
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    setFaces(detections.map((d) => Object.values(d.box)));

    console.log(detections);
    console.log(faces);
  };

  const enter = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    faces.map((face) => ctx.strokeRect(...face));
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  const addFriend = (e) => {
    setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(friends);

  return (
    <div className="container">
      <div className="left" style={{ width, height }}>
        <img 
        ref={imgRef} 
        crossOrigin="anonymous" 
        src={url} 
        alt="" 

        />

        <canvas
          onMouseEnter ={enter}
          ref={canvasRef}
          width={width}             
          height={height}
        >
        </canvas>
      </div>
    </div>
  );
};

