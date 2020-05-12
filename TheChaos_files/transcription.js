jQuery('document').ready(function() {
    // submit with Ctrl+Enter
    document.getElementById("transcribe").onkeydown = function (e) {
        // W3C and Microsoft's event models have differing ways of determining which key was pressed
        var keyCode = event.which || event.keyCode;

        if ((keyCode == 13 || keyCode == 10) && e.ctrlKey) {
            document.getElementById("submit").click(); // submit the form by hitting ctrl + enter
            return false; // preventing default action
        }
    }
    
    // report TTS support through the form
    document.getElementById("speech_support").value = window.SpeechSynthesisUtterance === undefined ? '0' : '1';

    // button to clear text area
    jQuery("#clear_button").click(function() {
        var tArea = document.getElementById('text_to_transcribe');
        tArea.value = '';
        tArea.focus();
        return false;
    });

    // set hide options in cookies
    jQuery('#options_button').click(function () {
        var hideOptions = !this.classList.contains('collapsed');
        setHideOptions(hideOptions);
    });

    // initialise tooltips
    jQuery(function () {
        jQuery('[data-toggle="tooltip"]').tooltip()
    })
});

function setHideOptions(hideOptions) {
    var d = new Date();
    d.setFullYear(d.getFullYear() + 10);
    var expires = "expires=" + d.toUTCString();
    if (hideOptions) {
        document.cookie = "hideOptions=" + hideOptions + "; " + expires + "; path=/;";
    } else {
        document.cookie = "hideOptions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}
