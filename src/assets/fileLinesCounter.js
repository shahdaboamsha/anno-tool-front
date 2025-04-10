import * as XLSX from 'xlsx';

const fileLineCounter = async (file, fileName) => {
  const fileType = fileName.split('.').pop().toLowerCase();

  if (fileType === 'csv') {
    const text = await file.text();
    const lines = text.trim().split('\n');
    return lines.length;

  } else if (fileType === 'xlsx') {
    // Return a Promise so we can await this
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          let totalLines = 0;
          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            totalLines += json.length;
          });

          resolve(totalLines); // ✅ This ensures the async/await works
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsArrayBuffer(file);
    });
  } else {
    console.error('Unsupported file type');
    return null;
  }
};

export default fileLineCounter;
