function accept(code) {
    fetch("/~a/accept/" + code)
    .then(res => {
        if (res.ok) window.location.reload();
    }).catch(err => {
        console.log(err);
    })
}

function reject(code) {
    fetch("/~a/reject/" + code)
    .then(res => {
        if (res.ok) window.location.reload();
    }).catch(err => {
        console.log(err);
    })
}