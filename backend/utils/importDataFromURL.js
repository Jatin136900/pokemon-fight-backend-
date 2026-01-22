export async function importDataFromURL(url, isPromiseRequired = false) {
    const response = await fetch(url);
    const result = isPromiseRequired ? response.json() : await response.json();
    return result;
}   