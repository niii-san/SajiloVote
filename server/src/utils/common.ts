/*
 * This file contains common helper functions
 */

export const generateId = (prefix: string): string => {
    if (!/^[A-Z]{2}$/.test(prefix)) {
        throw new Error("Prefix must be exactly two uppercase letters (A–Z)");
    }

    const uuid = crypto.randomUUID().replace(/-/g, "");
    return `${prefix}${uuid}`;
};

export const isDateValid = (dateTimeString: Date | string): boolean => {
    const date = Date.parse(dateTimeString as string);
    return !isNaN(date);
};

export function isObject(value: any) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
