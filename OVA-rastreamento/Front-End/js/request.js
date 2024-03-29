export function registerInteraction(data) {
    const url = "http://localhost:8000/interaction/register";

    // let formatted = formatDateTime(new Date());
    // data["date"] = formatted.date;
    // data["time"] = formatted.time;

    return doRequest(url, data);
}

export function doRequest(url, data, type="POST", is_login=0) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: type,
            url: url,
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

function formatDateTime(date) {
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();

    if (parseInt(day) < 10) day = `0${day}`;
    if (parseInt(month) < 10) month = `0${month}`;

    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hour = date.getHours();

    if (parseInt(seconds) < 10) seconds = `0${seconds}`;
    if (parseInt(minutes) < 10) minutes = `0${minutes}`;
    if (parseInt(hour) < 10) hour = `0${hour}`;

    return {
        date: `${year}/${month}/${day}`,
        time: `${hour}:${minutes}:${seconds}`
    };
}