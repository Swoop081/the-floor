package tv.thefloor.voicetest;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import java.util.ArrayList;

public class SpeechBridge {
    private static final int MIC_PERMISSION = 1001;
    private final MainActivity activity;
    private final WebView webView;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private SpeechRecognizer recognizer;
    private Intent intent;
    private boolean pendingStart;
    private boolean listening;

    SpeechBridge(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        if (SpeechRecognizer.isRecognitionAvailable(activity)) {
            recognizer = SpeechRecognizer.createSpeechRecognizer(activity);
            intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-AU");
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
            recognizer.setRecognitionListener(new Listener());
        }
    }

    void pageReady() {
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onReady&&window.floorNativeSpeech.onReady()");
    }

    @JavascriptInterface
    public void prepare() { handler.post(this::requestOrStart); }

    @JavascriptInterface
    public void startListening() { handler.post(this::requestOrStart); }

    @JavascriptInterface
    public void stopListening() { handler.post(this::stop); }

    private void requestOrStart() {
        if (activity.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingStart = true;
            activity.requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_PERMISSION);
            return;
        }
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onPermission(true)");
        if (recognizer == null) {
            error(2, "Speech recognizer unavailable on this TV");
            return;
        }
        if (listening) return;
        listening = true;
        try { recognizer.startListening(intent); }
        catch (Exception e) { listening = false; error(5, "Speech start failed"); }
    }

    private void stop() {
        if (recognizer != null) {
            try { recognizer.cancel(); } catch (Exception ignored) { }
        }
        listening = false;
    }

    void onPermissionResult(int requestCode, int[] grantResults) {
        if (requestCode != MIC_PERMISSION) return;
        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onPermission(" + granted + ")");
        if (granted && pendingStart) {
            pendingStart = false;
            handler.postDelayed(this::requestOrStart, 150);
        }
    }

    private void send(Bundle bundle, boolean partial) {
        if (bundle == null) return;
        ArrayList<String> results = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (results == null || results.isEmpty()) return;
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < results.size(); i++) {
            if (i > 0) json.append(',');
            json.append(quote(results.get(i)));
        }
        json.append(']');
        eval("window.floorNativeSpeech." + (partial ? "onPartial" : "onResults") + "(" + json + ")");
    }

    private void error(int code, String message) {
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onError(" + code + "," + quote(message) + ")");
    }

    private void eval(String js) { handler.post(() -> webView.evaluateJavascript(js, null)); }

    private String quote(String value) {
        if (value == null) value = "";
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", " ") + "\"";
    }

    void destroy() {
        stop();
        if (recognizer != null) recognizer.destroy();
    }

    private class Listener implements RecognitionListener {
        @Override public void onReadyForSpeech(Bundle params) { listening = true; }
        @Override public void onBeginningOfSpeech() { }
        @Override public void onRmsChanged(float rmsdB) { }
        @Override public void onBufferReceived(byte[] buffer) { }
        @Override public void onEndOfSpeech() { }
        @Override public void onEvent(int eventType, Bundle params) { }
        @Override public void onPartialResults(Bundle partialResults) { send(partialResults, true); }
        @Override public void onResults(Bundle results) { listening = false; send(results, false); }
        @Override public void onError(int code) {
            listening = false;
            String message;
            switch (code) {
                case SpeechRecognizer.ERROR_AUDIO: message = "Audio input error"; break;
                case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: message = "Microphone permission denied"; break;
                case SpeechRecognizer.ERROR_NETWORK: message = "Speech network error"; break;
                case SpeechRecognizer.ERROR_NETWORK_TIMEOUT: message = "Speech network timeout"; break;
                case SpeechRecognizer.ERROR_NO_MATCH: message = "No speech match"; break;
                case SpeechRecognizer.ERROR_RECOGNIZER_BUSY: message = "Recognizer busy"; break;
                case SpeechRecognizer.ERROR_SERVER: message = "Speech service error"; break;
                case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: message = "No speech heard"; break;
                default: message = "Speech error " + code;
            }
            error(code, message);
        }
    }
}
