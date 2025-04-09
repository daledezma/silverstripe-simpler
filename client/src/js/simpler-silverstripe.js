//import {default as $, default as jQueery} from 'jquery';
import {default as jQueery} from 'jquery'; // jquery as external needs to be commented out in webpack/.mix.js
import 'bootstrap'; // make bootstrap work globally (SS probably uses some special flavour combined with react components or so)
import Vue from 'vue'; // to hell with react...

// Scoped jQuery for our use only
const $ = jQueery;

// Global 'simpler' object to hold various data like modal content etc, watched by Vue to trigger required behaviour like actually opening said modal etc.
// “Uhm, why are you not using Vuex/Redux/some other complex way?” – Because why would I.
window.simpler = {
    // spinner HTML template
    spinner: '<div class="text-center p-3"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>',
    // modal
    modal: {
        show: false,
        title: "...",
        bodyHtml: "...",
        closeBtn: true,
        closeTxt: "Close",
        saveBtn: true,
        saveTxt: "Save",
    }
};

//
// Run early on to set some basics
//
(function() {

    // Simply make jQuery 3 available globally as '$' (framework includes 1.7.2 as external, comment that out in webpack/mix if necessary);
    // To check version: console.log(`$/jQueery: v${jQueery.fn.jquery}`);
    window.jQueery = jQueery;
    window.Vue = Vue; // global Vue (maybe 'expose' instead once I figure out how to do that...)

    // // DEV: output DOMNodesInserted & DOMNodesRemoved info
    // document.addEventListener('DOMNodesInserted', (event) => {
    //
    //     console.log('RECEIVING (document): DOMNodesInserted', event);
    //
    //     // $('.vue-instance').not('.vue-inited').each(function (){
    //     //     console.log('Paint it RED');
    //     //     $(this).css('color','red').addClass('vue-inited');
    //     //     new Vue({
    //     //         el: this,
    //     //     });
    //     // });
    // });

})();

//
// Init stuff which needs to be triggered just once on real pageload/DOMContentLoaded's
//
document.addEventListener('DOMContentLoaded', () => {

    // Inject modal into DOM manually
    if (!document.querySelector('#simplerAdminModal')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="simplerAdminModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="simpler.modal.show = false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body" id="simpleAdminModalBody" v-html="bodyHtml"></div>
                  <div class="modal-footer">
                    <button v-if="closeBtn" type="button" class="btn btn-secondary" data-dismiss="modal">{{ closeTxt }}</button>
                    <button v-if="saveBtn" type="button" class="btn btn-primary">{{ saveTxt }}</button>
                  </div>
                </div>
              </div>
            </div>
        `);
    }

    // Prevents double Vue instance
    if (!document.querySelector('#simplerAdminModal').__vue__) {
        new Vue({
            el: '#simplerAdminModal',
            data: simpler.modal,
            watch: {
                show: function (val) {
                    $('#simplerAdminModal').modal(val ? 'show' : 'hide');
                    if (!val) {
                        document.body.style.overflow = 'auto'; // Unlock scroll on close
                    }
                },
                bodyHtml: function () {
                    $('#simplerAdminModal').modal('handleUpdate');
                }
            }
        });

        // Sync Bootstrap modal events with Vue model
        $('#simplerAdminModal')
            .on('show.bs.modal', function () {
                simpler.modal.show = true;
            })
            .on('hide.bs.modal', function () {
                simpler.modal.show = false;
                document.body.style.overflow = 'auto'; // Ensure scroll reset
            });
    }

});

//
// Init stuff which needs to be triggered AFTER all other scripts etc
//
document.onreadystatechange = function () { // https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
    if (document.readyState === "interactive") {

        // document.addEventListener("DOMNodesInserted", function (event) {
        //     console.log('DOMNodesInserted EL:', event.target);
        // });

    }
}

// //
// // FilePond module compatibility helper: init filepond also on dynamically inserted nodes (via the synthetic simpler DOM events)
// //
// document.addEventListener("DOMNodesInserted", function () {
//     if (typeof FilePond !== "undefined") {
//         // initFilePond(); // has already been init'ed from filepond module on DOMContentLoaded...
//
//         // Attach filepond to all related inputs
//         var anchors = document.querySelectorAll('input[type="file"].filepond');
//         for (var i = 0; i < anchors.length; i++) {
//             var el = anchors[i];
//             var pond = FilePond.create(el);
//             var config = JSON.parse(el.dataset.config);
//             for (var key in config) {
//                 // We can set the properties directly in the instance
//                 // @link https://pqina.nl/filepond/docs/patterns/api/filepond-instance/#properties
//                 pond[key] = config[key];
//             }
//         }
//     }
// });

window.simpler = simpler;