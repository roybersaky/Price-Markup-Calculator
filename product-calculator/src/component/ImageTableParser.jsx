// ImageTableParser.jsx
import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import './ImageTableParser.css';

const ImageTableParser = ({ onProductsImported }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        // Convert to Grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]; // Weighted grayscale
          data[i] = gray;      // Red
          data[i + 1] = gray;  // Green
          data[i + 2] = gray;  // Blue
        }
  
        // Apply Thresholding (Binarization)
        for (let i = 0; i < data.length; i += 4) {
          const brightness = data[i]; // Since it's grayscale, all channels are the same
          if (brightness > 128) {  // Adjust this threshold if needed
            data[i] = 255; 
            data[i + 1] = 255; 
            data[i + 2] = 255;
          } else {
            data[i] = 0; 
            data[i + 1] = 0; 
            data[i + 2] = 0;
          }
        }
  
        ctx.putImageData(imageData, 0, 0);
  
        // Convert to Blob
        canvas.toBlob(blob => {
          resolve(blob);
        }, 'image/png');
      };
  
      img.onerror = (err) => reject(err);
      img.src = URL.createObjectURL(file);
    });
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setIsProcessing(true);
    setStatus('Preprocessing image...');
    setProgress(0);
  
    try {
      // Preprocess image before sending it to Tesseract
      const processedFile = await preprocessImage(file);
  
      setStatus('Running OCR...');
      const result = await Tesseract.recognize(
        processedFile,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          }
        }
      );
  
      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);
      
      const products = parseProductsFromText(extractedText);
      
      if (products.length > 0) {
        onProductsImported(products);
        setStatus(`Successfully imported ${products.length} products.`);
      } else {
        setStatus('No products found in the image. Try a clearer image.');
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      setStatus('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const parseProductsFromText = (text) => {
    const products = [];

    // Standardize separators (remove extra spaces around '|')
    const standardizedText = text.replace(/\|\s*/g, ' ');

    // Split lines, trim, and remove empty ones
    const lines = standardizedText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    console.log('Standardized OCR lines:', lines);

    // General regex pattern for products
    const productPattern = /(.+?)\s+([SO58\d]+)PCS\s+USD\s*([SO58\d]+\.?[SO58\d]*)/i;

    for (const line of lines) {
        // Try matching the general product format
        const match = line.match(productPattern);

        if (match) {
            const name = match[1].trim();
            
            // Fix OCR errors in amount (PCS count)
            let amountStr = match[2]
                .replace(/S/g, '5')  // Replace S → 5
                .replace(/O/g, '0')  // Replace O → 0
                .replace(/^5?00$/, '500'); // Fix common misreads like "SO00" → "500"

            let amount = parseInt(amountStr, 10);

            // Fix OCR errors in price
            let priceStr = match[3]
                .replace(/S/g, '5')  // Replace S → 5
                .replace(/O/g, '0')  // Replace O → 0
                .replace(/USDO/g, 'USD0'); // Fix "USDO" → "USD0"

            let price = parseFloat(priceStr);

            console.log('Match found:', { name, amount, originalPrice: match[3], cleanedPrice: priceStr });

            if (!isNaN(amount) && !isNaN(price)) {
                const total = price * amount;
                products.push({ name, amount, price, total });
            } else {
                console.warn('Invalid amount or price:', { name, amount, price });
            }
        } else {
            // Handle special cases
            const specialMatch = line.match(/(.+?)\s+(\d+)PCS\s+USD(\d+\.\d+)\/PCS\s+USD(\d+\.\d+)/i);
            if (specialMatch) {
                const name = specialMatch[1].trim();
                const amount = parseInt(specialMatch[2], 10);
                const price = parseFloat(specialMatch[3]);

                console.log('Special match found:', { name, amount, price });

                if (!isNaN(amount) && !isNaN(price)) {
                    const total = price * amount;
                    products.push({ name, amount, price, total });
                }
            } else {
                // Match "TON" format
                const tonMatch = line.match(/(.+?)\s+([\d\.]+)TON\s+USD(\d+)\/PCS/i);
                if (tonMatch) {
                    const name = tonMatch[1].trim();
                    const amount = parseFloat(tonMatch[2]);
                    const price = parseInt(tonMatch[3], 10);

                    console.log('TON match found:', { name, amount, price });

                    if (!isNaN(amount) && !isNaN(price)) {
                        const total = price * amount;
                        products.push({ name, amount, price, total, unit: 'TON' });
                    }
                } else {
                    console.warn('No match for line:', line);
                }
            }
        }
    }

    console.log('Final products:', products);
    return products;
};

  

  return (
    <div className="image-parser-container">
      <h2>Import Products from Image</h2>
      <p className="description">
        Upload a screenshot of your product table to automatically extract product data.
      </p>
      
      <div className="file-upload-area">
      <label 
  htmlFor="file-input" 
  className={`upload-label ${isProcessing ? 'disabled' : ''}`}
>
  {isProcessing ? 'Processing...' : 'Select Image'}
</label>
<input
  id="file-input"
  type="file"
  ref={fileInputRef}
  onChange={handleFileChange}
  accept="image/jpeg, image/png, image/gif"
  disabled={isProcessing}
  className="file-input"
  style={{ display: 'none' }} // Hide the input
/>

      </div>
      
      {isProcessing && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      )}
      
      {status && <div className="status-message">{status}</div>}
      
      <div className="tips">
        <h3>Tips for best results:</h3>
        <ul>
          <li>Take a clear screenshot of just the product table</li>
          <li>Make sure text is clearly visible and not blurry</li>
          <li>Use high-contrast images (black text on white background)</li>
          <li>Crop the image to include only the table data</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageTableParser;