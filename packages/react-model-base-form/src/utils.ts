// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractValueFrom = (valueOrEvent: any) => {
  const target = valueOrEvent?.currentTarget || valueOrEvent?.target;
  const isDomEvent = Boolean(target);
  if (isDomEvent && target.type === 'checkbox') return target.checked;
  return isDomEvent ? target.value : valueOrEvent;
};
