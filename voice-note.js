/**
 * Voice Note Recorder - voice-note.js
 * Complete JavaScript functionality for voice recording feature
 */

class VoiceNoteRecorder {
            constructor() {
                this.mediaRecorder = null;
                this.audioChunks = [];
                this.isRecording = false;
                this.recordingTime = 0;
                this.timerInterval = null;
                this.audioUrl = null;
                this.audioBlob = null;
                
                this.initializeElements();
                this.setupEventListeners();
                this.checkMicrophoneSupport();
            }
            
            initializeElements() {
                this.voiceNoteBtn = document.getElementById('voiceNoteBtn');
                this.voiceModal = document.getElementById('voiceModal');
                this.closeModal = document.getElementById('closeModal');
                this.recordBtn = document.getElementById('recordBtn');
                this.stopBtn = document.getElementById('stopBtn');
                this.playBtn = document.getElementById('playBtn');
                this.recordingStatus = document.getElementById('recordingStatus');
                this.recordingTimer = document.getElementById('recordingTimer');
                this.audioPlayer = document.getElementById('audioPlayer');
                this.sendVoiceNote = document.getElementById('sendVoiceNote');
                this.resetRecording = document.getElementById('resetRecording');
                this.errorMessage = document.getElementById('errorMessage');
                this.successMessage = document.getElementById('successMessage');
                this.waveformBars = document.getElementById('waveformBars');
                
                this.createWaveformBars();
            }
            
            createWaveformBars() {
                for (let i = 0; i < 50; i++) {
                    const bar = document.createElement('div');
                    bar.className = 'waveform-bar';
                    bar.style.height = '10px';
                    this.waveformBars.appendChild(bar);
                }
            }
            
            setupEventListeners() {
                // THIS IS THE KEY PART - Button click opens modal
                this.voiceNoteBtn.addEventListener('click', () => {
                    console.log('Voice note button clicked!'); // Debug log
                    this.openModal();
                });
                
                this.closeModal.addEventListener('click', () => this.closeModalHandler());
                this.recordBtn.addEventListener('click', () => this.startRecording());
                this.stopBtn.addEventListener('click', () => this.stopRecording());
                this.playBtn.addEventListener('click', () => this.playRecording());
                this.sendVoiceNote.addEventListener('click', () => this.sendRecording());
                this.resetRecording.addEventListener('click', () => this.resetRecordingHandler());
                
                // Close modal when clicking outside
                this.voiceModal.addEventListener('click', (e) => {
                    if (e.target === this.voiceModal) {
                        this.closeModalHandler();
                    }
                });
            }
            
            checkMicrophoneSupport() {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    this.showError('Your browser does not support microphone recording. Please use a modern browser like Chrome, Firefox, or Safari.');
                    this.voiceNoteBtn.disabled = true;
                }
            }
            
            openModal() {
                console.log('Opening voice note modal...'); // Debug log
                this.voiceModal.classList.add('active');
                this.resetRecordingHandler();
                document.body.style.overflow = 'hidden';
            }
            
            closeModalHandler() {
                if (this.isRecording) {
                    this.stopRecording();
                }
                this.voiceModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            async startRecording() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            sampleRate: 44100
                        }
                    });
                    
                    this.mediaRecorder = new MediaRecorder(stream);
                    this.audioChunks = [];
                    this.recordingTime = 0;
                    
                    this.mediaRecorder.ondataavailable = (event) => {
                        this.audioChunks.push(event.data);
                    };
                    
                    this.mediaRecorder.onstop = () => {
                        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                        this.audioUrl = URL.createObjectURL(this.audioBlob);
                        this.audioPlayer.src = this.audioUrl;
                        this.audioPlayer.style.display = 'block';
                        this.sendVoiceNote.disabled = false;
                        this.playBtn.disabled = false;
                        
                        stream.getTracks().forEach(track => track.stop());
                    };
                    
                    this.mediaRecorder.start();
                    this.isRecording = true;
                    this.updateUI();
                    this.startTimer();
                    this.startWaveformAnimation();
                    
                } catch (error) {
                    this.showError('Could not access microphone. Please ensure you have granted microphone permissions.');
                    console.error('Error accessing microphone:', error);
                }
            }
            
            stopRecording() {
                if (this.mediaRecorder && this.isRecording) {
                    this.mediaRecorder.stop();
                    this.isRecording = false;
                    this.updateUI();
                    this.stopTimer();
                    this.stopWaveformAnimation();
                }
            }
            
            playRecording() {
                if (this.audioPlayer.paused) {
                    this.audioPlayer.play();
                    this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    this.audioPlayer.pause();
                    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                
                this.audioPlayer.onended = () => {
                    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                };
            }
            
            updateUI() {
                if (this.isRecording) {
                    this.recordingStatus.textContent = '🔴 Recording... (speak now)';
                    this.recordingStatus.classList.add('recording');
                    this.recordBtn.disabled = true;
                    this.stopBtn.disabled = false;
                } else {
                    this.recordingStatus.textContent = this.audioBlob ? '✅ Recording complete! You can play it back or send it.' : 'Click the red button to start recording';
                    this.recordingStatus.classList.remove('recording');
                    this.recordBtn.disabled = false;
                    this.stopBtn.disabled = true;
                }
            }
            
            startTimer() {
                this.timerInterval = setInterval(() => {
                    this.recordingTime++;
                    const minutes = Math.floor(this.recordingTime / 60);
                    const seconds = this.recordingTime % 60;
                    this.recordingTimer.textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);
            }
            
            stopTimer() {
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
            }
            
            startWaveformAnimation() {
                const bars = this.waveformBars.querySelectorAll('.waveform-bar');
                this.waveformInterval = setInterval(() => {
                    bars.forEach(bar => {
                        const height = Math.random() * 60 + 10;
                        bar.style.height = `${height}px`;
                    });
                }, 100);
            }
            
            stopWaveformAnimation() {
                if (this.waveformInterval) {
                    clearInterval(this.waveformInterval);
                    this.waveformInterval = null;
                }
                
                const bars = this.waveformBars.querySelectorAll('.waveform-bar');
                bars.forEach(bar => {
                    bar.style.height = '10px';
                });
            }
            
            async sendRecording() {
                if (!this.audioBlob) return;
                
                try {
                    this.sendVoiceNote.disabled = true;
                    this.sendVoiceNote.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    
                    // Simulate sending delay
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    this.showSuccess('🎉 Voice note recorded successfully! In a real implementation, this would be sent to your server.');
                    
                    // Create download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = this.audioUrl;
                    downloadLink.download = `voice-note-${new Date().toISOString().slice(0, 19)}.wav`;
                    downloadLink.click();
                    
                } catch (error) {
                    this.showError('Failed to send voice note. Please try again.');
                } finally {
                    this.sendVoiceNote.disabled = false;
                    this.sendVoiceNote.innerHTML = '<i class="fas fa-paper-plane"></i> Send Voice Note';
                }
            }
            
            resetRecordingHandler() {
                this.stopRecording();
                this.audioChunks = [];
                this.recordingTime = 0;
                this.recordingTimer.textContent = '00:00';
                this.audioPlayer.style.display = 'none';
                this.sendVoiceNote.disabled = true;
                this.playBtn.disabled = true;
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.updateUI();
                this.hideMessages();
                
                if (this.audioUrl) {
                    URL.revokeObjectURL(this.audioUrl);
                    this.audioUrl = null;
                }
                this.audioBlob = null;
            }
            
            showError(message) {
                this.errorMessage.textContent = message;
                this.errorMessage.style.display = 'block';
                this.successMessage.style.display = 'none';
            }
            
            showSuccess(message) {
                this.successMessage.textContent = message;
                this.successMessage.style.display = 'block';
                this.errorMessage.style.display = 'none';
            }
            
            hideMessages() {
                this.errorMessage.style.display = 'none';
                this.successMessage.style.display = 'none';
            }
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Initializing Voice Note Recorder...'); // Debug log
            new VoiceNoteRecorder();
            
            // Handle regular form submission
            document.getElementById('contact-form').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Regular form submission would happen here.');
            });