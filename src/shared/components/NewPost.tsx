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
        console.log(faces.map((face) => face))
        var [x, y, w, h] = faces[0];
        x = x;
        y = y - (0.4 * w);
        w = w;
        h = 1.4 * w;
        const img = imgRef.current;
        console.log('x antes',x)
        console.log('y antes', y)
        console.log('w antes',w)
        console.log('h antes', h)
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx && img) {
            // redimensiona a imagem original para a resolução máxima necessária
            const MAX_WIDTH = 5000;
            const MAX_HEIGHT = 10000;
            const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
            const newWidth = Math.floor(w * ratio);
            const newHeight = Math.floor(h * ratio);
            const factor = 179 / w

            // calcula as proporções para cada dimensão
            const xRatio = (x * factor) ;
            const yRatio = (y * factor) ;
            const wRatio = (w * factor) ;
            const hRatio = (h * factor) ;
            const Larg = (img.width * factor)
            const altu = (img.height * factor)
            const deltaX =  (20/ factor) 
            const deltaY =  (120/ factor) 
            console.log('x',xRatio)
            console.log('y', yRatio)
            console.log('w',wRatio)
            console.log('h', hRatio)
            console.log('l',Larg)
            console.log('a', altu)
            console.log('factor', factor)
            canvas.width = 295;
            canvas.height = 412;
            console.log('corte x :' + ( x - deltaX) )
            console.log('corte y :' + (y - deltaY))
            console.log('corte w :' + (w + 2 * (0.71 * deltaX)))
            console.log('corte h :' + (h + 2 * deltaY))

            ctx.drawImage(img, x , y  , w  , h  , 0, 0, 295, 412)
              // cria um novo canvas e contexto para a imagem redimensionada
              const newCanvas = document.createElement('canvas');
              const newCtx = newCanvas.getContext('2d');

              // redimensiona a imagem desenhada no canvas original
              const newWidth2 = 295// novo valor de largura;
              const newHeight2 = 412// novo valor de altura;
              newCanvas.width = newWidth2;
              newCanvas.height = newHeight2;
              if(newCtx){
              newCtx.drawImage(canvas, 0, 0, newWidth2, newHeight2);

              console.log(canvas.width + 'x' + canvas.height);
              // cria um novo arquivo a partir do blob gerado pelo novo canvas
                newCanvas.toBlob((blob) => {
                  if (blob) {
                    const newFile = new File([blob], 'image.jpg', { type: blob.type });
                    const newBlobUrl = URL.createObjectURL(newFile);

                    // atualiza o estado com a URL do novo arquivo criado
                    setFriends((prev) => ({
                      ...prev,
                      face: { blobUrl: newBlobUrl, srcset: '' },
                    }));
                  }
                }, 'image/jpeg', 1.0); // qualidade 100%
              }
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
    }, 10000);

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
        <>
                        <img
                        src={friends.face.blobUrl}
                        alt=""
                        srcSet={friends.face.srcset}
                        style={{ width, height }}
                      />

        <img
          src={friends.face.blobUrl}
          alt=""
          srcSet={friends.face.srcset}

        />

        </>
      ) : (
        <div style={{ display: showMessage ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center'   }}>
          <ReactLoading  type = {'spin'} color={'#000000'} height={50} width={50} />

          <p>Detectando Rosto...</p>
        </div>
      )}
    </div>
  );
};
