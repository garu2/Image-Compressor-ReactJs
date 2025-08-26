import { useState } from 'react'
import './App.css'

function App() {

  const [urlFile, setUrlFile] = useState(null); 
  const [sizeImage, setSizeImage] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);


  const getFileSize = (bytesImage) => {
    if (bytesImage < 1024) {
      return `${bytesImage} bytes`;
    } else if (bytesImage < 1024 * 1024) {
      return `${(bytesImage / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytesImage / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
 
  const onPickFile = async (file) => {
    if (!file) return;

    const orginalUrl = URL.createObjectURL(file);
    const originalSize = file.size;
    setUrlFile(orginalUrl);
    setSizeImage(getFileSize(originalSize));

    const img = new Image();
    img.src = orginalUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
    
    const compressedUrl = URL.createObjectURL(blob);
    const compressedSize = blob.size;

    if (compressedSize < originalSize) {
      setCompressedUrl(compressedUrl);
      setCompressedSize(getFileSize(compressedSize));
    } else {
      setCompressedUrl(orginalUrl);
      setCompressedSize(getFileSize(originalSize));
    }
  }
          
  return (  
    <>
      <h1>Image Compressor</h1>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => onPickFile(e.target.files[0])}
      />
      <div className="container-images">
        <div>
          {urlFile && (
            <>
              <h4>Antes ({sizeImage})</h4>
              <img src={urlFile} alt="" />
            </>
          )}
        </div>
        <div>
          {compressedUrl && (
            <>
              <h4>Después ({compressedSize})</h4>
              <img src={compressedUrl} alt="" />
              <a href={compressedUrl} download="compressed-image.jpg">Descargar</a>
            </>
          )}
        </div>
      </div>
    </>
  )
} 
 
export default App
  