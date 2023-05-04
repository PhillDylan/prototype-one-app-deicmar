import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import faceNotDetected from '../assets/img/face_not_detected.jpg';
import ReactLoading from 'react-loading';


interface ImageProps {
  url: string;
  width: number;
  height: number;
}

interface FriendsProps {
  face?: {
    blobUrl: string;
    srcset: string;
  };
}


export const NewPost = ({ image }: { image: ImageProps }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState<number[][]>([]);
  const [friends, setFriends] = useState<FriendsProps>({});

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const croppedCanvasRef = useRef<HTMLCanvasElement>(null);

  const [showMessage, setShowMessage] = useState(false);

  const handleImage = async () => {
    if (imgRef.current) {
      // Pass img to model
      const detections = await faceapi.detectAllFaces(
        imgRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      setFaces(detections.map((d) => Object.values(d.box) as number[]));
    }
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
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'blue';
        faces.map((face) => ctx.strokeRect(face[0], face[1], face[2], face[3]));
      }
    };

    const drawCropped = () => {
      if (faces.length > 0) {
        const [x, y, w, h] = faces[0];
        const img = imgRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx && img) {
            // redimensiona a imagem original para a resolução máxima necessária
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 800;
            const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
            const newWidth = Math.floor(w * ratio);
            const newHeight = Math.floor(h * ratio);
            
            // calcula as proporções para cada dimensão
            const xRatio = (x - 45) / img.width;
            const yRatio = (y - 50) / img.height;
            const wRatio = (w + 90) / img.width;
            const hRatio = (h + 90) / img.height;
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, xRatio * img.width, yRatio * img.height, wRatio * img.width, hRatio * img.height, 0, 0, newWidth, newHeight);
    
            // cria um novo arquivo a partir do blob gerado pelo canvas
            canvas.toBlob((blob) => {
              if (blob) {
                const newFile = new File([blob], 'image.jpg', { type: blob.type });
                const newBlobUrl = URL.createObjectURL(newFile);
    
                // atualiza o estado com a URL do novo arquivo criado
                setFriends((prev) => ({
                  ...prev,
                  face: { blobUrl: newBlobUrl, srcset: '' },
                }));
              }
            }, 'image/jpeg', 0.8); // qualidade 80%
          }
        }
      }
    };
    
    

    enter();
    drawCropped();
  }, [faces]);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (!friends.face) {
        setShowMessage(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [friends.face]);


  return (
    <div className="container">
      {!showMessage ? (
         <div className='left' style={{ width, height , display: friends.face ? 'none' : 'none' }}>
         <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
 
             <canvas ref={canvasRef} width={width} height={height}></canvas>
 
             <canvas ref={croppedCanvasRef} style={{ display: 'none' }}></canvas>
           </div>
      ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={faceNotDetected} alt="" style={{ width: '295px', height: '412px' }} />
            <p>Sem rosto detectado</p>
          </div> 
      )}
      {friends.face ? (
        <img
          src={friends.face.blobUrl}
          alt=""
          srcSet={friends.face.srcset}
          style={{ width: '295px', height: '412px' }}
        />
      ) : (
        <div style={{ display: showMessage ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center'   }}>
          <ReactLoading  type = {'spin'} color={'#000000'} height={50} width={50} />
          <p>Detectando Rosto...</p>
        </div>
      )}
    </div>
  );
};
