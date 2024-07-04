export const validateName = (value: string) => {
  if (!value) return 'Please enter your name.';
  if (value.includes('e')) return "The letter 'e' cannot be included";
};

export const validateAge = (value: string) => {
  if (!value) return 'Please enter your age.';
  if (Number(value) < 10) return 'Should be bigger than 10';
};
export const validateCities = (value: string[]) => {
  if (!value.length) return 'Should select city..';
};
