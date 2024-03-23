const obj = {
  name: 'tomas',
  city: { cityName: 'Game', throne: { throneName: 'Garbi' } },
};

const newObj = { ...obj };

newObj.city.cityName = 'newName';
console.log(obj);
