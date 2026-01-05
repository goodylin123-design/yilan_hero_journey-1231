// 英雄主題音樂生成器
// 宜蘭民謠風格、海岸感、慢步調、療癒系、適合冥想與行走

class HeroMusicGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentOscillators = [];
        this.currentGainNodes = [];
    }

    // 初始化 Audio Context
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return true;
        } catch (error) {
            console.error('無法初始化 Audio Context:', error);
            return false;
        }
    }

    // 生成海浪聲（白噪音 + 低頻濾波）
    createWaveSound(duration = 10) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // 生成海浪般的白噪音
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // 低通濾波器模擬海浪聲
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;

        // 音量包絡（緩慢起伏）
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        return { source, gainNode };
    }

    // 生成主旋律（五聲音階，宜蘭民謠風格 - 參考「天清宜蘭」曲風）
    createMelody() {
        // 五聲音階：C, D, E, G, A (對應 261.63, 293.66, 329.63, 392.00, 440.00 Hz)
        // 擴展到兩個八度，增加旋律豐富度
        const pentatonicScale = [
            261.63, 293.66, 329.63, 392.00, 440.00,  // 第一組
            523.25, 587.33, 659.25, 783.99, 880.00  // 第二組（高八度）
        ];
        const melody = [];

        // 輕快海洋風格：活潑、輕盈、有節奏感
        const melodyPattern = [
            // 開場：輕快上升
            { note: 0, duration: 1.5, octave: 0 }, // C (低)
            { note: 2, duration: 1, octave: 0 }, // E
            { note: 4, duration: 1, octave: 0 }, // A
            { note: 1, duration: 1.5, octave: 1 }, // D (高)
            
            // 中段：活潑跳躍
            { note: 0, duration: 1, octave: 1 }, // C (高)
            { note: 3, duration: 1.5, octave: 0 }, // G
            { note: 2, duration: 1, octave: 1 }, // E (高)
            { note: 4, duration: 1, octave: 0 }, // A
            { note: 1, duration: 1, octave: 1 }, // D (高)
            
            // 高潮：輕快高音
            { note: 3, duration: 1, octave: 1 }, // G (高)
            { note: 2, duration: 1, octave: 1 }, // E (高)
            { note: 0, duration: 1.5, octave: 1 }, // C (高)
            { note: 4, duration: 1, octave: 1 }, // A (高)
            
            // 結尾：輕快回落
            { note: 3, duration: 1, octave: 1 }, // G (高)
            { note: 2, duration: 1, octave: 0 }, // E
            { note: 0, duration: 2, octave: 0 }, // C (結束)
        ];

        melodyPattern.forEach(({ note, duration, octave }) => {
            const baseIndex = octave * 5; // 0 或 5
            melody.push({
                frequency: pentatonicScale[baseIndex + note],
                duration: duration,
                startTime: melody.length > 0 
                    ? melody[melody.length - 1].startTime + melody[melody.length - 1].duration 
                    : 0
            });
        });

        return melody;
    }

    // 生成低音伴奏（輕快的節奏，海洋感）
    createBassLine() {
        // 使用 C、G、A 的低八度作為基礎
        const bassNotes = [130.81, 196.00, 220.00]; // C2, G2, A2
        const bassLine = [];

        // 輕快的節奏模式，營造海洋活力感
        const bassPattern = [
            { note: 0, duration: 1.5 }, // C
            { note: 1, duration: 1 }, // G
            { note: 0, duration: 1 }, // C
            { note: 2, duration: 1.5 }, // A
            { note: 1, duration: 1 }, // G
            { note: 0, duration: 1 }, // C
            { note: 1, duration: 1.5 }, // G
            { note: 0, duration: 1.5 }, // C
            { note: 1, duration: 1 }, // G
            { note: 0, duration: 1.5 }, // C
        ];

        let currentTime = 0;
        bassPattern.forEach(({ note, duration }) => {
            bassLine.push({
                frequency: bassNotes[note],
                duration: duration,
                startTime: currentTime
            });
            currentTime += duration;
        });

        return bassLine;
    }

    // 播放單個音符（改進：更柔和的音色，參考「天清宜蘭」風格）
    playNote(frequency, startTime, duration, volume = 0.3, type = 'sine', vibrato = false) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // 使用更柔和的波形（sine 或 triangle）
        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // 添加輕微的顫音（vibrato），增加宜蘭民謠的韻味
        if (vibrato && duration > 2) {
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.frequency.value = 4; // 4 Hz 的顫音
            lfoGain.gain.value = frequency * 0.01; // 1% 的頻率變化
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start(startTime);
            lfo.stop(startTime + duration);
            this.currentOscillators.push(lfo);
        }

        // 更柔和的音量包絡（更長的淡入淡出，營造空靈感）
        const fadeIn = Math.min(0.8, duration * 0.2);
        const fadeOut = Math.min(0.8, duration * 0.2);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + fadeIn);
        gainNode.gain.setValueAtTime(volume, startTime + duration - fadeOut);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        this.currentOscillators.push(oscillator);
        this.currentGainNodes.push(gainNode);
    }

    // 播放完整音樂
    async play() {
        if (this.isPlaying) {
            this.stop();
            return;
        }

        if (!this.audioContext) {
            const initialized = await this.init();
            if (!initialized) {
                alert('無法初始化音訊系統，請確認瀏覽器支援 Web Audio API');
                return;
            }
        }

        // 如果 Audio Context 被暫停，恢復它
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.isPlaying = true;
        const startTime = this.audioContext.currentTime;

        // 播放海浪背景音（循環）
        const waveSound = this.createWaveSound(10);
        waveSound.source.loop = true;
        waveSound.source.start(startTime);

        // 播放主旋律（輕快海洋風格：活潑、有節奏感）
        const melody = this.createMelody();
        melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
            // 輕快的音符，不使用顫音
            this.playNote(frequency, startTime + noteStart, duration, 0.3, 'sine', false);
        });

        // 播放低音伴奏（同步開始，營造節奏感）
        const bassLine = this.createBassLine();
        bassLine.forEach(({ frequency, duration, startTime: noteStart }) => {
            this.playNote(frequency, startTime + noteStart, duration, 0.2, 'triangle', false);
        });

        // 添加輕快的和聲層次
        // 第一層：高八度和聲（輕快點綴）
        melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
            if (index % 2 === 0 && duration >= 1) {
                this.playNote(frequency * 2, startTime + noteStart + 0.1, duration - 0.1, 0.15, 'sine', false);
            }
        });

        // 第二層：三度和聲（增加輕快感）
        melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
            if (index % 3 === 0 && duration >= 1) {
                const thirdFreq = frequency * 1.25; // 大三度音程
                this.playNote(thirdFreq, startTime + noteStart + 0.05, duration - 0.1, 0.1, 'sine', false);
            }
        });

        // 計算音樂總時長
        const totalDuration = Math.max(
            melody[melody.length - 1].startTime + melody[melody.length - 1].duration,
            bassLine[bassLine.length - 1].startTime + bassLine[bassLine.length - 1].duration
        ) + 2;

        // 音樂結束後自動循環播放（不停止）
        const loopMusic = () => {
            if (!this.isPlaying) return;

            // 清除當前的 oscillators（但保留海浪聲）
            this.currentOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {}
            });
            this.currentOscillators = [];
            this.currentGainNodes = [];

            // 重新播放旋律和伴奏（海浪聲繼續）
            const newStartTime = this.audioContext.currentTime;
            melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
                const useVibrato = duration >= 3;
                this.playNote(frequency, newStartTime + noteStart, duration, 0.28, 'sine', useVibrato);
            });

            bassLine.forEach(({ frequency, duration, startTime: noteStart }) => {
                this.playNote(frequency, newStartTime + noteStart + 0.5, duration, 0.18, 'triangle', false);
            });

            melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
                if (index % 2 === 0 && duration >= 2) {
                    this.playNote(frequency * 2, newStartTime + noteStart + 0.3, duration - 0.3, 0.12, 'sine', false);
                }
            });

            melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
                if (index % 3 === 0 && duration >= 2.5) {
                    const fifthFreq = frequency * 1.5;
                    this.playNote(fifthFreq, newStartTime + noteStart + 0.2, duration - 0.4, 0.08, 'sine', false);
                }
            });

            // 繼續循環
            setTimeout(loopMusic, totalDuration * 1000);
        };

        setTimeout(loopMusic, totalDuration * 1000);
    }

    // 停止播放
    stop() {
        this.isPlaying = false;
        
        this.currentOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {}
        });
        
        this.currentGainNodes.forEach(gain => {
            try {
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            } catch (e) {}
        });

        this.currentOscillators = [];
        this.currentGainNodes = [];
    }

    // 生成音樂描述
    getMusicDescription() {
        return {
            title: '輕快海洋之歌 - 擺渡蘭陽',
            style: '開放版權 · 輕快海洋風格',
            mood: '輕快、活潑、療癒、海岸感',
            tempo: '中快步調（約 80-90 BPM）',
            scale: '五聲音階（C, D, E, G, A），雙八度',
            elements: [
                '海浪背景音（白噪音 + 低通濾波）',
                '主旋律（五聲音階，輕快活潑）',
                '低音伴奏（C-G-A 變化，節奏感）',
                '多層和聲（高八度 + 三度和聲）',
                '輕快節奏（適合海岸行走）'
            ],
            duration: '約 20 秒（可循環）',
            usage: '適合在任務進行時播放，營造輕快宜蘭海岸氛圍',
            copyright: '開放版權，可自由使用'
        };
    }
}

// 導出供其他腳本使用
if (typeof window !== 'undefined') {
    window.HeroMusicGenerator = HeroMusicGenerator;
}

