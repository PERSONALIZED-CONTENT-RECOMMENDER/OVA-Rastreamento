const PORT = 8000;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`

export function registerInteraction(data) {
    const url = "/interaction/register";
    return doRequest(url, data);
}

export function doRequest(url, data, type="POST", is_login=0) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: type,
            url: BASE_URL + url,
            data: JSON.stringify([data]),
            dataType: "json",
            crossDomain: true,
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin":"http:"
            },
            success: (response) => resolve(response),
            error: (response) => reject(response)
        });
    });
}