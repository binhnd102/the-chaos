var voices = [];

function getVoices() {
    if (typeof speechSynthesis === 'undefined') {
      return;
    }
    
    let newVoices = window.speechSynthesis.getVoices().filter(function(v) { return v.lang == dialect; }).sort(function(a, b) { return (a.default === b.default) ? 0 : a.default ? -1 : 1; });
    if (newVoices.length == voices.length) {
        return;
    }
    
    voices = newVoices;
    refreshVoices();
}

function refreshVoices() {
    var vs = jQuery("#voiceSelect");
    if (vs) {
        vs.find('option').remove();
        var voiceURI = getCookie("speech_voice_" + dialect);

        for(i = 0; i < voices.length ; i++) {
            var voice = voices[i];
            var optionText = voice.name;
            if (voice.default) {
                optionText += ' (default)';
            }

            var option = new Option(optionText, i);
            if (voiceURI == voice.voiceURI) {
                option.selected = true
            }
            vs.append(option);
        }
    }
}

jQuery('document').ready(function() {
    getVoices();
                         
    // Chrome/Mozilla: wait on voices to be loaded before fetching list
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = getVoices;
    }

    jQuery("#stop").click(function() {
        resetSpeech();
        return false;
    });
     
    jQuery("#play").click(function() {
        toggleSpeech();
        return false;
    });
     
    jQuery("#voiceSelect").change(function() {
        resetSpeech();
        var uri = voices[this.selectedIndex].voiceURI
        if (uri) {
            updateSelectedVoice(uri);
        }
        return false;
    });

    jQuery("#speechRate").change(function() {
        resetSpeech();
        updateSpeechRate(this.value);
        return false;
    });
                         
    window.onbeforeunload = function(e) {
        speechSynthesis.cancel();
    };
});

function resetSpeech() {
    speechSynthesis.cancel();
    resetControls(true);
}

function resetControls(stop) {
    var b = jQuery("#play");
    b.removeClass("pause");
    if (!b.hasClass("play")) b.addClass("play");
    if (stop || !speechSynthesis.speaking) b.removeClass("speaking");
}

function controlsPlaying() {
    if (!speechSynthesis.speaking) resetControls(true);
    
    var b = jQuery("#play");
    b.removeClass("play");
    if (!b.hasClass("pause")) b.addClass("pause");
    if (!b.hasClass("speaking")) b.addClass("speaking");
}

function toggleSpeech() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
    } else {
        if (speechSynthesis.speaking) {
            speechSynthesis.resume();
        } else {
            speak(htmlDecode(transcribed_text));
        }
    }
}

// say a message
function speak(text) {
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = dialect;
    if (voices && voices.length > 0) {
        var v = 0;
        var vs = jQuery("#voiceSelect").get(0);
        if (vs) {
            v = vs.selectedIndex;
        }
        u.voice = voices[v];
    }
    u.rate = document.getElementById("speechRate").value / 100; // 0.7;
    
    u.onstart = function () {
        controlsPlaying();
    };
    u.onresume = u.onstart;
    
    u.onend = function () {
        resetControls(true);
    };
    
    u.onpause = function () {
        resetControls(false);
    };
    
    u.onerror = function (e) {
        resetControls(true);
    };
    
    speechSynthesis.speak(u);
}

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function updateSelectedVoice(value) {
    var d = new Date();
    d.setFullYear(d.getFullYear() + 10);
    var expires = "expires=" + d.toUTCString();
    document.cookie = "speech_voice_" + dialect + "=" + value + "; " + expires + "; path=/";
}

function updateSpeechRate(value) {
    var d = new Date();
    d.setFullYear(d.getFullYear() + 10);
    var expires = "expires=" + d.toUTCString();
    document.cookie = "speech_rate=" + value + "; " + expires + "; path=/";
}

function getCookie(name) {
    var pairs = document.cookie.split("; "),
        count = pairs.length, parts;
    
    while (count--) {
        parts = pairs[count].split("=");
        if ( parts[0] === name )
            return parts[1];
    }
    return false;
}
