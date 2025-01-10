export const getArguments = () => {
    const keys = process.argv.filter((arg, idx) => idx > 1 && !(idx % 2));
    const values = process.argv.filter((arg, idx) => idx > 1 && idx % 2);
    return keys.map((k, idx) => {
        return {
            [k.substring(1)]: values[idx]
        };
    }).reduce((result, currentObject) => {
        for (var key in currentObject) {
            result[key] = currentObject[key];
        }
        return result;
    });
};
