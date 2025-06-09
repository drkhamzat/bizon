const fs = require('fs');
const path = require('path');

// Функция для копирования файла с проверкой существования исходного файла
function copyFile(source, destination) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destination);
    console.log(`Файл ${source} успешно скопирован в ${destination}`);
    return true;
  } else {
    console.error(`Ошибка: Файл ${source} не существует`);
    return false;
  }
}

// Основная функция обновления
function updateFiles() {
  try {
    // Копирование исправленного index.js
    copyFile(
      path.join(__dirname, 'server', 'src', 'index.js.new'),
      path.join(__dirname, 'server', 'src', 'index.js')
    );

    // Копирование исправленного .env
    copyFile(
      path.join(__dirname, 'server', '.env.new'),
      path.join(__dirname, 'server', '.env')
    );

    // Копирование исправленного package.json
    copyFile(
      path.join(__dirname, 'package.json.new'),
      path.join(__dirname, 'package.json')
    );

    console.log('Все файлы успешно обновлены!');
    console.log('Теперь сервер должен запускаться даже без подключения к MongoDB.');
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении файлов:', error);
    return false;
  }
}

// Запуск обновления
updateFiles();

// Обновление для автоматического запуска
if (require.main === module) {
  const success = updateFiles();
  process.exit(success ? 0 : 1);
} 