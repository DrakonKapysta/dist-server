function executeAsync(index) {
  return Promise.resolve().then(() => {
    console.log(`Выполняется обработчик ${index}`);
    return Promise.resolve().then(() => {
      console.log(`Выполняется обработчик under ${index}`);
    });
  });
}

for (let i = 0; i < 5; i++) {
  executeAsync(i);
}

for (let i = 0; i < 100; i++) {
  console.log(i);
}
