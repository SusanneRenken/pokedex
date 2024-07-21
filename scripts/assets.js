let One = load("One") || [];
let Two = load("Two") || [];

function saveAll() {
    save("One", One);
    save("Two", Two);
  }
  
  function save(key, array) {
    let value = JSON.stringify(array);
    localStorage.setItem(key, value);
  }
  
  function load(key) {
    let ArrayAsText = localStorage.getItem(key);
    if (ArrayAsText) {
      return JSON.parse(ArrayAsText);
    }
    return null;
  }