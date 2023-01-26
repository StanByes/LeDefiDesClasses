function signCallback(ajaxMsg, res) {
    let json = res.responseJSON;
    let msg = "";
    switch (json.code) {
        case 409: {
            msg = "Ce compte existe déjà";
            break;
        }

        case 201: {
            msg = "Compte créé avec succès";
            ajaxMsg.removeClass("bg-danger");
            ajaxMsg.addClass("bg-success");

            setTimeout(() => {
                location.reload();
            }, 1950);
            break;
        }

        case 400: {
            msg = "Erreur interne, veuillez contacter l'administrateur";
            break;
        }
    }
    
    ajaxMsg.append(`<p>${msg}</p>`);
    ajaxMsg.show();
    ajaxMsg.animate({opacity: 1});

    setTimeout(() => {
        ajaxMsg.animate({opacity: 0});
        setTimeout(() => {
            ajaxMsg.hide();
            ajaxMsg.empty();
        }, 450);
    }, 1500);
}

function loginCallback(ajaxMsg, res) {
    let json = res.responseJSON;
    let msg = "";
    switch (json.code) {
        case 404: {
            msg = "Compte introuvable";
            break;
        }

        case 422: {
            msg = "Mot de passe incorrect";
            break;
        }

        case 200: {
            msg = "Connecté avec succès";
            ajaxMsg.removeClass("bg-danger");
            ajaxMsg.addClass("bg-success");

            setTimeout(() => {
                location.reload();
            }, 1950);
            break;
        }

        case 400: {
            msg = "Erreur interne, veuillez contacter l'administrateur";
            break;
        }
    }
    
    ajaxMsg.append(`<p>${msg}</p>`);
    ajaxMsg.show();
    ajaxMsg.animate({opacity: 1});

    setTimeout(() => {
        ajaxMsg.animate({opacity: 0});
        setTimeout(() => {
            ajaxMsg.hide();
            ajaxMsg.empty();
        }, 450);
    }, 1500);
}