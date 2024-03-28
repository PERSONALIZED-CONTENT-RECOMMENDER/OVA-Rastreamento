function getFullData(data) {
    return {
        user: localStorage.getItem("user"),
        action: data
    }
}

export function doRequest(url, data, type="POST", is_login=0) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: type,
            url: url,
            data: JSON.stringify([(is_login) ? data : getFullData(data)]),
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