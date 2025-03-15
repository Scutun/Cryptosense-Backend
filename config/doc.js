// cryptosense_backend/config/doc.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

// Пути
const docsPath = path.join(__dirname, '../docs'); // Путь к папке docs
const outputPath = path.join(docsPath, 'main.swagger.yaml'); // Путь к объединённому файлу

// Находим все .swagger.yaml файлы в папке docs (исключаем main.swagger.yaml)
const swaggerFiles = glob.sync(path.join(docsPath, '*.swagger.yaml')).filter(file => !file.includes('main.swagger.yaml'));

console.log('✅ Найдены файлы для объединения:', swaggerFiles);

// Основная структура OpenAPI
const mergedData = {
  openapi: '3.0.0',
  info: {
    title: 'CryptoSense API',
    version: '1.0.0',
    description: 'Объединённая API-документация',
  },
  paths: {},
};

// Объединяем все файлы
swaggerFiles.forEach(file => {
  try {
    const content = yaml.load(fs.readFileSync(file, 'utf8'));
    if (content.paths) {
      Object.assign(mergedData.paths, content.paths);
    }
    console.log(`📄 Объединён: ${file}`);
  } catch (error) {
    console.error(`❌ Ошибка при обработке файла: ${file}`, error);
  }
});

// Сохраняем объединённый файл
fs.writeFileSync(outputPath, yaml.dump(mergedData), 'utf8');
console.log(`🎉 Файл успешно объединён: ${outputPath}`);
