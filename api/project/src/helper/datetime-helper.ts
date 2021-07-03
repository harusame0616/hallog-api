let fixedDateTime: Date |undefined = undefined;

export const fixDatetime = (dateTime: Date) => {
    fixedDateTime = dateTime;
}

export const releaseDatetime = () => {
    fixedDateTime = undefined;
}

export const getCurrentDatetime = () => {
    return fixedDateTime || new Date();
}
