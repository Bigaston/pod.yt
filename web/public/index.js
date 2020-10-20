// Affichage de l'erreur
let hash = window.location.hash;

if (!!hash) {
    let p_content = "";

    if (hash == "#code_already_used") {
        p_content = "Le code que vous voulez utiliser est déjà déclaré";
    } else if (hash == "#not_good_playlist") {
        p_content = "Le lien de la playlist n'est pas un lien valide";
    } else if (hash == "#not_good_channel") {
        p_content = "Le lien de la chaîne n'est pas un lien valide";
    } else if (hash == "#not_good_format") {
        p_content = "Les paramètres que vous avez entré ne corresponsent pas aux critères requis"
    }

    let p = document.createElement("p");
    p.innerHTML = p_content;
    document.getElementById("error_div").appendChild(p);
}

// Vérification de si le code est pas déjà utilisé
let code = document.getElementById("code")
let error_p = document.getElementById("error_p");
code.addEventListener("focusout", (event) => {
    fetch("/~check_code/" + code.value)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        }).then(data => {
            if (data.return != "OK") {
                code.style.borderColor = "red";
                error_p.innerHTML = "Ce code est déjà utilisé!";
            } else {
                code.style.borderColor = null;
                error_p.innerHTML = "";
            }
        }).catch(err => {
            console.log(err)
        })
})