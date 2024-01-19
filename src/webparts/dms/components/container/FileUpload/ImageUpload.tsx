import * as React from "react";
import { useState } from "react";
import styles from "./image.module.scss";
import { getSentenceFromCamelCase } from "./Helpers";

export interface FileProps {
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  loading?: boolean;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  onChange: (name: string, value: File[] | boolean) => void;
  bgColor?: string;
  style?: React.CSSProperties;
  validationHandler?: (name: string, error: string) => void;
  value?: File[] | boolean;
  size?: string;
}

const ImageUpload = ({
  name,
  size,
  bgColor = "success",
  disabled,
  loading,
  error,
  required,
  label,
  onChange,
  validationHandler,
  value,
  multiple,
  className,
}: FileProps) => {
  const [dragging, setDragging] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const files: File[] = Array.from(e.dataTransfer.files || []);
    setDraggedFiles(files);
    onChange && onChange(name, files);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;

    if (files) {
      const fileArray = Array.from(files);
      setDraggedFiles(fileArray);
      onChange && onChange(name, fileArray);
    } else {
      console.error("No files selected.");
    }
  };

  const onValidationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!validationHandler) return;
    const { value } = event.target;
    let errorMessage = "";
    if (!value && required) {
      errorMessage = `Please upload ${getSentenceFromCamelCase(name)}.`;
    }
    validationHandler(name, errorMessage);
  };

  return (
    <div className={`${styles.container} ${styles[size ? size : ""]}`}>
      <label htmlFor={name}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>

      <div
        className={`${styles.uploadContainer}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className={` ${dragging ? styles.dragging : ""}`}>
          <div className={styles.uploadWrapper}>
            <button
              className={`${styles.uploadBtn} ${
                styles[size ? size : ""]
              } ${className} `}
              disabled={loading}
            >
              {!loading ? (
                <span>Click Here to upload or drag your files here</span>
              ) : (
                <div>Uploading</div>
              )}
            </button>
            <input
              id={name}
              type="file"
              disabled={disabled}
              onChange={onChangeHandler}
              onBlur={onValidationChange}
              // value={value}
              multiple={multiple}
              name={name}
              required={required}
            />
            {error ? (
              <span className={`${styles.required} `}>{error}</span>
            ) : null}
            {draggedFiles.length > 0 && (
              <div className={styles.droppedImages}>
                {draggedFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Dropped ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
