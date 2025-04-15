/*
 * This file contains common helper functions
 */

export const isValidDate = (dateStr: string): boolean => {
    return !isNaN(Date.parse(dateStr));
};
