/*
 * This file contains common helper functions
 */
export const isDateValid = (dateTimeString: Date | string): boolean => {
    const date = Date.parse(dateTimeString as string);
    return !isNaN(date);
};

export function isObject(value: any) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
