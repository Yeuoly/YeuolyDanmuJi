const messager = new SpeechSynthesisUtterance();
export const speaker_controller = {
    speakDanmu(danmu){
        this.speak(danmu.user.id + '说：' + danmu.message);
    },
    onEnd(fn){
        messager.addEventListener('end',() => {
            setTimeout(fn,0);
        });
    },
    speak(text){
        messager.text = text;
        speechSynthesis.speak(messager);
    },
    setSpeed(speed){
        messager.rate = speed;
    },
    setVolume(vol){
        messager.volume = vol;
    },
    setPitch(pitch){
        messager.pitch = pitch;
    },
    setVoice(voice){
        messager.voice = voice;
    }
}