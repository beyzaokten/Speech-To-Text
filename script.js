document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM yüklendi');

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    console.log('SpeechRecognition başlatıldı:', recognition);

    const languageSelect = document.getElementById('language');
    const resultContainer = document.querySelector('.result p.resultText');
    const startListeningButton = document.querySelector('.btn.record');
    const recordButtonText = document.querySelector('.btn.record p');
    const clearButton = document.querySelector('.btn.clear');
    const downloadButton = document.querySelector('.btn.download');

    let recognizing = false;

    console.log('languages:', languages);

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.text = language.name;
        languageSelect.add(option);
    });

    console.log('Dil seçenekleri yüklendi');

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value; 

   
    languageSelect.addEventListener('change', () => {
        recognition.lang = languageSelect.value;
        console.log('Tanıma dili değiştirildi:', recognition.lang);
    });

    startListeningButton.addEventListener('click', toggleSpeechRecognition);

    clearButton.addEventListener('click', clearResults);

    downloadButton.disabled = true;

    recognition.onstart = () => {
        console.log('SpeechRecognition başladı');
    };

    recognition.onresult = (event) => {
        console.log('recognition.onresult tetiklendi');
        let result = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            result += event.results[i][0].transcript;
        }
        console.log('Tanınan metin:', result);
        resultContainer.textContent = result;
        downloadButton.disabled = false;
    };

    recognition.onerror = (event) => {
        console.error('Konuşma tanıma hatası:', event.error);
    };

    recognition.onend = () => {
        console.log('SpeechRecognition durduruldu');
        recognizing = false;
        startListeningButton.classList.remove('recording');
        recordButtonText.textContent = 'Start Listening';
    };

    downloadButton.addEventListener('click', downloadResult);

    function toggleSpeechRecognition() {
        if (recognizing) {
            recognition.stop();
            console.log('SpeechRecognition durduruldu');
        } else {
            recognition.start();
            console.log('SpeechRecognition başlatıldı');
        }

        recognizing = !recognizing;
        startListeningButton.classList.toggle('recording', recognizing);
        recordButtonText.textContent = recognizing ? 'Stop Listening' : 'Start Listening';
    }

    function clearResults() {
        resultContainer.textContent = '';
        downloadButton.disabled = true;
    }

    function downloadResult() {
        const resultText = resultContainer.textContent;
        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Your-Text.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
