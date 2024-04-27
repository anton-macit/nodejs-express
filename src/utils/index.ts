import { isBoolean, isNumber, isString } from "lodash";

export const formatUnknown = (
  details?: unknown, // undefined | null | number | string | boolean | object
) => {
  if (
    details === undefined ||
    details === null ||
    isNumber(details) ||
    isString(details) ||
    isBoolean(details)
  ) {
    return details;
  }

  // @ts-ignore it cannot be undefined, null, number, string, boolean - so, it's object
  if ("stack" in details) {
    return { ...details, stack: details.stack }; // we have to call stack
  }

  const asString = String(details);

  // '[object Object]' is not needed
  if (asString === "[object Object]") {
    return details;
  }

  return { ...details, asString };
};
