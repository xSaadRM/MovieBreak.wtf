const obj = temp1;
obj.circularRef = obj;

// Custom replacer function to handle circular references
const replacer = (key, value) => {
  if (typeof value === "object" && value !== null) {
    if (cache.includes(value)) {
      return "[Circular]";
    }
    cache.push(value);
  }
  return value;
};

// Array to keep track of visited objects
const cache = [];

// Convert the object to JSON with the custom replacer
const jsonStringos = JSON.stringify(obj, replacer);

// Copy the JSON string to clipboard
copy(jsonStringos);
