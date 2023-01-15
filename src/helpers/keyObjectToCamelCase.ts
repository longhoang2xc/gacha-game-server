//all object keys to camelCase
export const keyObjectToCamelCase = (object: any) => {
  var newObject, origKey, newKey, value;
  if (object instanceof Array) {
    return object.map(value => {
      if (typeof value === "object") {
        value = keyObjectToCamelCase(value);
      }
      return value;
    });
  } else {
    newObject = {} as any;
    for (origKey in object) {
      if (object.hasOwnProperty(origKey)) {
        newKey = (
          origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
        ).toString();
        value = object[origKey] ?? "";
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = keyObjectToCamelCase(value);
        }
        newObject[newKey] = value;
      }
    }
  }
  return newObject;
};
