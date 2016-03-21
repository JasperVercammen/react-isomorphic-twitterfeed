export default function syncActionCreator(type, ...argNames) {
  if (typeof type === 'undefined' || type.length === 0) {
    throw new Error('A type is needed for each action.');
  }

  return function(...args) {
    let action = { type };
    argNames.forEach((arg, index) => {
      if (args[index]) {
        action[argNames[index]] = args[index];
      }
    });
    return action;
  };
}
