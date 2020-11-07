const INITIAL_STATE = {
  authenticated: false
};

export default (state=INITIAL_STATE, action) => {
  const { type } = action;

  switch (type) {
    default:
      return state;
  }
};
