import { ChangeEvent, useState } from "react";
import Tesseract from "tesseract.js";
import styles from "./App.module.scss";

function App() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [textResult, setTextResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files?.length === 0) return;

    setTextResult("");
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
  };

  const recognizeText = () => {
    if (!selectedImage) return;

    setIsLoading(true);

    Tesseract.recognize(selectedImage, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(m.progress * 100);
        }
      },
    })
      .then((result) => {
        setTextResult(result.data.text);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const convertButtonClassName = textResult
    ? `${styles.convertButton} ${styles.hidden}`
    : styles.convertButton;

  return (
    <div className={styles.app}>
      <div className={styles.imageUploader}>
        <h1>Convert your image to text</h1>
        <label htmlFor="file-input" className={styles.fileInputLabel}>
          Upload
        </label>
        <input
          type="file"
          accept="image/*"
          id="file-input"
          className={styles.fileInput}
          onChange={uploadImage}
        />
      </div>
      {selectedImage && (
        <div className={styles.imageAndText}>
          <img src={selectedImage} className={styles.selectedImage} />
          {isLoading ? (
            <p className={styles.progress}>{Math.round(progress)}%</p>
          ) : (
            <button
              className={convertButtonClassName}
              disabled={!selectedImage}
              onClick={recognizeText}
            >
              Convert
            </button>
          )}
          <div className={styles.output}>
            {!isLoading && textResult && (
              <p className={styles.textResult}>{textResult}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
