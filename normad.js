/*!
 * normad v1.2.0
 * Normalisation d'Adresse à partir des Open Data Gouvernementales
 * 
 * ISC License
 * by X-ray Computing
 */
document.addEventListener("DOMContentLoaded", function () {
    if (typeof normaFields !== 'undefined') {
        // Contrôle la saisie de l'adresse
        if (!Array.isArray(normaFields)) {
            var aFields = new Array(normaFields);
        } else {
            var aFields = normaFields;
        }
        for (field of aFields) {
            let addAddress = document.getElementById(field.address);
            let addPostCode = document.getElementById(field.postcode);
            let addLocality = document.getElementById(field.city);
            let partial = field.partial;

            addPostCode.addEventListener('change', (event) => {
                if (partial) {
                    var data = 'q=' + addPostCode.value + '&type=municipality';
                } else {
                    var data = 'q=' + encodeURIComponent(addAddress.value) + '&postcode=' + addPostCode.value;
                }

                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var data = JSON.parse(xhr.response);
                        if (!data.hasOwnProperty('features')) {
                            console.log('Normad: Bad Response ("features" is missing)');
                            return false;
                        }
                        // Is Bootstrap loaded ?
                        var isBootstrap = false;
                        var scriptList = document.querySelectorAll('script');
                        for (var i = 0; i < scriptList.length; i++) {
                            if (scriptList[i].src.indexOf('bootstrap') > 0) {
                                var version = bootstrap.Tooltip.VERSION;
                                isBootstrap = true;
                                break;
                            }
                        }
                        var addresses = [];
                        var indexes = [];
                        // Deduplicate datas
                        for (var i = 0; i < data.features.length; i++) {
                            let row = data.features[i];
                            if (indexes.indexOf(row.properties.id) < 0) {
                                addresses.push({id: row.properties.id, address: row.properties.name, postcode: row.properties.postcode, city: row.properties.city});
                                indexes.push(row.properties.id);
                            }
                        }

                        if (addresses.length > 1) {
                            // Create Modal
                            var modale = document.getElementById('normadModal');
                            var creation = false;

                            if (typeof (modale) == 'undefined' || modale == null) {
                                creation = true;
                                let m = document.createElement('div');
                                m.className = 'modal';
                                m.setAttribute('tabindex', -1);
                                m.setAttribute('role', 'dialog');
                                m.setAttribute('id', 'normadModal');

                                let md = document.createElement('div');
                                md.className = 'modal-dialog';
                                md.setAttribute('role', 'document');

                                let mc = document.createElement('div');
                                mc.className = 'modal-content';
                                // Header
                                let mh = document.createElement('div');
                                mh.className = 'modal-header';

                                let mt = document.createElement('h5');
                                mt.className = 'modal-title';

                                let mx = document.createElement('button');
                                mx.className = 'close';
                                mx.setAttribute('type', 'button');
                                mx.setAttribute('data-dismiss', 'modal');
                                mx.setAttribute('aria-label', 'Fermer');

                                let icon = document.createElement('span');
                                icon.setAttribute('aria-hidden', 'true');
                                icon.innerHTML = '&times;'

                                mx.appendChild(icon);
                                mh.appendChild(mt);
                                mh.appendChild(mx);
                                // Body
                                let mb = document.createElement('div');
                                mb.className = 'modal-body';
                                // Footer
                                let mf = document.createElement('div');
                                mf.className = 'modal-footer';

                                let ba = document.createElement('button');
                                ba.className = 'btn btn-primary'
                                ba.setAttribute('type', 'button');
                                ba.innerHTML = 'Valider mon choix';

                                let bc = document.createElement('button');
                                bc.className = 'btn btn-secondary';
                                bc.setAttribute('type', 'button');
                                bc.innerHTML = 'Annuler';
                                bc.setAttribute('data-dismiss', 'modal');

                                mf.appendChild(ba);
                                mf.appendChild(bc);

                                mc.appendChild(mh);
                                mc.appendChild(mb);
                                mc.appendChild(mf);
                                md.appendChild(mc);
                                m.appendChild(md);

                                // Add Modal to DOM
                                document.body.appendChild(m);

                                modale = document.getElementById('normadModal');
                                var body = mb;
                            } else {
                                var body = modale.querySelector('.modal-body');
                            }
                            // Reset Body
                            while (body.firstChild && body.removeChild(body.firstChild));

                            // Complete
                            modale.querySelector('.modal-title').innerHTML = 'Choisissez une adresse valide';
                            for (var i = 0; i < addresses.length; i++) {
                                let text = addresses[i].postcode + ' - ' + addresses[i].city;
                                if (!partial) {
                                    text = addresses[i].address + ', ' + text;
                                }

                                // Input-Group Bootstrap 4.5
                                let ig = document.createElement('div');
                                ig.className = "input-group mb-1";

                                let ip = document.createElement('input');
                                // ip.className = "form-check-input mt-0";
                                ip.setAttribute('type', 'radio');
                                ip.setAttribute('id', 'normAddr-' + i);
                                ip.setAttribute('name', 'normadChoice');
                                ip.dataset.id = i;
                                if (isBootstrap) {
                                    if (version.indexOf('5.') < 0) {
                                        var igpp = document.createElement('div');
                                        igpp.className = "input-group-prepend";
                                    }
                                    let igp = document.createElement('div');
                                    igp.className = "input-group-text";

                                    igp.appendChild(ip);
                                    if (version.indexOf('5.') < 0) {
                                        igpp.appendChild(igp);
                                        ig.appendChild(igpp);
                                    } else {
                                        ig.appendChild(igp);
                                    }
                                } else {
                                    ig.appendChild(ip);
                                }
                                let il = document.createElement('label');
                                il.className = 'form-control';
                                il.setAttribute('for', 'normAddr-' + i);
                                il.innerHTML = text;

                                ig.appendChild(il);

                                body.appendChild(ig);
                            }
                            // Modale Bootstrap
                            if (isBootstrap) {
                                var my = new bootstrap.Modal(modale);
                                my.show();
                            } else {
                                // Display Modal
                                modale.style.display = 'block';
                                // Close Event Handler
                                modale.querySelector('.btn-secondary').addEventListener('click', (event) => {
                                    modale.style.display = "none";
                                });
                                modale.querySelector('.close').addEventListener('click', (event) => {
                                    modale.style.display = "none";
                                });
                            }

                            // Select Event Handler
                            modale.querySelector('.btn-primary').addEventListener('click', (event) => {
                                let checked = document.querySelectorAll('input[name="normadChoice"]:checked');
                                if (checked.length == 1) {
                                    if (!partial) {
                                        addAddress.value = addresses[checked[0].dataset.id].address;
                                    }
                                    addPostCode.value = addresses[checked[0].dataset.id].postcode;
                                    addLocality.value = addresses[checked[0].dataset.id].city;
                                    addLocality.dispatchEvent(new Event('change'));
                                }
                                if (isBootstrap) {
                                    my.hide();
                                } else {
                                    modale.style.display = "none";
                                }
                            });
                        } else if (addresses.length == 1) {
                            // One answer
                            if (!partial) {
                                addAddress.value = addresses[0].address;
                            }
                            addPostCode.value = addresses[0].postcode;
                            addLocality.value = addresses[0].city;
                            addLocality.dispatchEvent(new Event('change'));
                        } else {
                            console.log('Normad: No Address Found');
                        }
                    } else {
                        console.log('Normad: Request Failed');
                    }
                };
                xhr.onerror = function () {
                    console.log("Normad: Query Failed");
                };
                if ("withCredentials" in xhr) {
                    xhr.open('GET', 'https://api-adresse.data.gouv.fr/search/?' + data, true);
                } else if (typeof XDomainRequest != "undefined") {
                    xhr.open('GET', 'https://api-adresse.data.gouv.fr/search/?' + data);
                } else {
                    xhr = null;
                    throw new Error('CORS not supported');
                }
                if (xhr !== null) {
                    xhr.send();
                }
            });
        }
    } else {
        console.log("'normaFields' var. not defined.");
    }
});