$(document).ready(function() {
    $('form[ajax="true"]').each(function() {
        $(this).submit(function(e) {
            e.preventDefault();
            sendRequest($(this)[0]);
        })
    });
})

/**
 * 
 * @param {Element} form 
 */
function sendRequest(form) {
    let ajax = $(form.children.item(0));
    let data = {};
    for (let el of form.elements) {
        if (!el.name)
            continue;

        if (!el.value) {
            if (ajax) {
                ajax.append("<p>Veuillez remplir tous les champs</p>");
                ajax.show();
                ajax.animate({opacity: 1});

                setTimeout(() => {
                    ajax.animate({opacity: 0});
                    setTimeout(() => {
                        ajax.hide();
                        ajax.empty();
                    }, 450);
                }, 1500);
            }

            return;
        }
        
        data[el.name] = el.value;
    }
    
    $.ajax({
        url: form.action,
        data: data,
        type: form.method.toUpperCase(),
        complete: function(data) {
            let callbackName = form.getAttribute("callbackName");
            window[callbackName + "Callback"](ajax, data);
        }
    })
}