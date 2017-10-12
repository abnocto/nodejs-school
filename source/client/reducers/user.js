function getInitialState() {
  return {
    login: 'login',
    name: 'name',
  };
}

export default (state = getInitialState(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};
