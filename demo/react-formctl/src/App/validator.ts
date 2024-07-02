export const validateName = (value: string) => {
  if (!value) return 'Please enter your name.';
  if (value.includes('e')) return "The letter 'e' cannot be included";
};

export const validateAge = (value: string) => {
  if (!value) return 'Please enter your age.';
  if (Number(value) < 20) return 'Teenager is prohibited.';
};
export const validateCities = (value: string[]) => {
  if (!value.length) return 'Please select at least one city.';
};
