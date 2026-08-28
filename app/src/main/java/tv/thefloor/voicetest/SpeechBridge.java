package tv.thefloor.voicetest;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import java.util.ArrayList;
import java.util.Arrays;

public class SpeechBridge {
    private static final int MIC_PERMISSION = 1001;
    private static final long MIN_RESTART_GAP_MS = 350L;
    private static final int PERIODIC_REBUILD_SESSIONS = 24;

    private final MainActivity activity;
    private final WebView webView;
    private final Handler handler = new Handler(Looper.getMainLooper());

    private SpeechRecognizer recognizer;
    private Intent intent;
    private boolean usingOnDevice;
    private boolean forcedSystemFallback;
    private boolean pendingPermissionStart;
    private boolean listening;
    private boolean wanted;
    private boolean startScheduled;
    private boolean destroyed;
    private boolean hostActive = true;
    private boolean needsRebuild;
    private int startGeneration;
    private int completedSessions;
    private int busyStreak;
    private int rateLimitStreak;
    private long lastStartAt;
    private long backoffUntil;

    SpeechBridge(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        buildIntent();
        createRecognizer(false);
    }

    private void buildIntent() {
        intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-AU");
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 8);

        if (Build.VERSION.SDK_INT >= 33) {
            intent.putStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, buildBiasStrings());
            intent.putExtra(RecognizerIntent.EXTRA_ENABLE_FORMATTING, RecognizerIntent.FORMATTING_OPTIMIZE_LATENCY);
            intent.putExtra(RecognizerIntent.EXTRA_HIDE_PARTIAL_TRAILING_PUNCTUATION, true);
        }
    }

    private ArrayList<String> buildBiasStrings() {
        return new ArrayList<>(Arrays.asList(
                "pass",
                "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
                "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
                "twenty one", "twenty four", "twenty five", "thirty", "forty",
                "pizza", "chicken wings", "grapes", "cheese", "sushi", "steak", "burger", "hamburger", "croissant",
                "mushroom", "sandwich", "eggs", "french fries", "chips", "avocado", "banana", "pineapple", "coconut",
                "tomato", "onion", "potato", "baguette", "orange", "kiwi", "pear", "capsicum", "bell pepper",
                "black olives", "bread", "coffee beans", "mussels", "lime",
                "blue", "green", "cold", "down", "right", "woof", "bark", "meow", "bed", "feet", "head",
                "days", "months", "ice", "east", "west", "fruit", "vegetable", "puppy", "kitten", "school",
                "go", "pepper", "white", "scissors", "night", "fork", "butter", "star", "you", "time", "wall", "round", "farm", "boat"
        ));
    }

    private void createRecognizer(boolean forceSystem) {
        if (destroyed) return;

        if (recognizer != null) {
            try { recognizer.cancel(); } catch (Exception ignored) { }
            try { recognizer.destroy(); } catch (Exception ignored) { }
            recognizer = null;
        }

        usingOnDevice = false;
        boolean canUseOnDevice = !forceSystem && !forcedSystemFallback && Build.VERSION.SDK_INT >= 31
                && SpeechRecognizer.isOnDeviceRecognitionAvailable(activity);

        if (canUseOnDevice) {
            try {
                recognizer = SpeechRecognizer.createOnDeviceSpeechRecognizer(activity);
                usingOnDevice = true;
            } catch (Exception ignored) {
                recognizer = null;
            }
        }

        if (recognizer == null && SpeechRecognizer.isRecognitionAvailable(activity)) {
            try {
                recognizer = SpeechRecognizer.createSpeechRecognizer(activity);
                usingOnDevice = false;
            } catch (Exception ignored) {
                recognizer = null;
            }
        }

        if (recognizer != null) recognizer.setRecognitionListener(new Listener());
        completedSessions = 0;
        busyStreak = 0;
        rateLimitStreak = 0;
        needsRebuild = false;
        updateEngineStatus();
    }

    private void updateEngineStatus() {
        String label;
        if (recognizer == null) label = "Speech recognizer unavailable";
        else if (usingOnDevice) label = "On-device speech engine";
        else label = "System speech engine";
        eval("(function(){var n=document.getElementById('native');if(n)n.innerHTML=" + quote(label + "<br>Remote mic ready") + ";})()");
    }

    void pageReady() {
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onReady&&window.floorNativeSpeech.onReady()");
        handler.postDelayed(this::updateEngineStatus, 80L);
    }

    @JavascriptInterface
    public void prepare() {
        handler.post(() -> {
            if (!hostActive) return;
            wanted = true;
            requestOrStart();
        });
    }

    @JavascriptInterface
    public void startListening() {
        handler.post(() -> {
            if (!hostActive) return;
            wanted = true;
            requestOrStart();
        });
    }

    @JavascriptInterface
    public void stopListening() {
        handler.post(this::stopInternal);
    }

    private void requestOrStart() {
        if (destroyed || !hostActive || !wanted) return;

        if (activity.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingPermissionStart = true;
            activity.requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_PERMISSION);
            return;
        }

        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onPermission(true)");

        if (needsRebuild || completedSessions >= PERIODIC_REBUILD_SESSIONS) {
            createRecognizer(false);
        }

        if (recognizer == null) {
            wanted = false;
            error(99, "Speech recognizer unavailable on this TV");
            return;
        }
        if (listening || startScheduled) return;

        long now = SystemClock.elapsedRealtime();
        long earliest = Math.max(lastStartAt + MIN_RESTART_GAP_MS, backoffUntil);
        long delay = Math.max(0L, earliest - now);
        if (delay > 0L) {
            startScheduled = true;
            final int generation = startGeneration;
            handler.postDelayed(() -> {
                startScheduled = false;
                if (generation == startGeneration && hostActive && wanted) requestOrStart();
            }, delay);
            return;
        }

        listening = true;
        lastStartAt = now;
        try {
            recognizer.startListening(intent);
        } catch (Exception e) {
            listening = false;
            needsRebuild = true;
            backoffUntil = SystemClock.elapsedRealtime() + 700L;
            error(5, "Speech start failed — resetting engine");
        }
    }

    private void stopInternal() {
        startGeneration++;
        startScheduled = false;
        wanted = false;
        pendingPermissionStart = false;
        if (recognizer != null) {
            try { recognizer.cancel(); } catch (Exception ignored) { }
        }
        listening = false;
    }

    void hostPaused() {
        handler.post(() -> {
            hostActive = false;
            stopInternal();
        });
    }

    void hostResumed() {
        handler.post(() -> {
            hostActive = true;
            backoffUntil = 0L;
            updateEngineStatus();
        });
    }

    void onPermissionResult(int requestCode, int[] grantResults) {
        if (requestCode != MIC_PERMISSION) return;
        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onPermission(" + granted + ")");
        if (granted && hostActive && (pendingPermissionStart || wanted)) {
            pendingPermissionStart = false;
            wanted = true;
            handler.postDelayed(this::requestOrStart, 220L);
        } else if (!granted || !hostActive) {
            pendingPermissionStart = false;
            wanted = false;
        }
    }

    private void send(Bundle bundle, boolean partial) {
        if (!hostActive || destroyed || bundle == null) return;
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
        if (!hostActive || destroyed) return;
        eval("window.floorNativeSpeech&&window.floorNativeSpeech.onError(" + code + "," + quote(message) + ")");
    }

    private void eval(String js) {
        if (destroyed) return;
        handler.post(() -> {
            if (!destroyed) webView.evaluateJavascript(js, null);
        });
    }

    private String quote(String value) {
        if (value == null) value = "";
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", " ") + "\"";
    }

    void destroy() {
        destroyed = true;
        hostActive = false;
        startGeneration++;
        wanted = false;
        pendingPermissionStart = false;
        startScheduled = false;
        if (recognizer != null) {
            try { recognizer.cancel(); } catch (Exception ignored) { }
            try { recognizer.destroy(); } catch (Exception ignored) { }
        }
        recognizer = null;
        listening = false;
    }

    private void handleRecoverableError(int code) {
        long now = SystemClock.elapsedRealtime();
        completedSessions++;

        if (code == SpeechRecognizer.ERROR_RECOGNIZER_BUSY) {
            busyStreak++;
            backoffUntil = now + Math.min(1600L, 550L + (busyStreak * 300L));
            if (busyStreak >= 2) needsRebuild = true;
            return;
        }

        if (Build.VERSION.SDK_INT >= 31 && code == SpeechRecognizer.ERROR_TOO_MANY_REQUESTS) {
            rateLimitStreak++;
            backoffUntil = now + Math.min(3500L, 1200L + (rateLimitStreak * 650L));
            if (rateLimitStreak >= 2) needsRebuild = true;
            return;
        }

        busyStreak = 0;
        if (code == SpeechRecognizer.ERROR_NO_MATCH || code == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) {
            backoffUntil = now + 180L;
            return;
        }

        if (code == SpeechRecognizer.ERROR_AUDIO || code == SpeechRecognizer.ERROR_SERVER
                || code == SpeechRecognizer.ERROR_NETWORK || code == SpeechRecognizer.ERROR_NETWORK_TIMEOUT
                || (Build.VERSION.SDK_INT >= 31 && code == SpeechRecognizer.ERROR_SERVER_DISCONNECTED)) {
            backoffUntil = now + 850L;
            needsRebuild = true;
        }
    }

    private class Listener implements RecognitionListener {
        @Override public void onReadyForSpeech(Bundle params) {
            if (hostActive) listening = true;
        }

        @Override public void onBeginningOfSpeech() { }
        @Override public void onRmsChanged(float rmsdB) { }
        @Override public void onBufferReceived(byte[] buffer) { }
        @Override public void onEndOfSpeech() { }
        @Override public void onEvent(int eventType, Bundle params) { }

        @Override public void onPartialResults(Bundle partialResults) {
            send(partialResults, true);
        }

        @Override public void onResults(Bundle results) {
            listening = false;
            completedSessions++;
            busyStreak = 0;
            rateLimitStreak = 0;
            backoffUntil = 0L;
            send(results, false);
        }

        @Override public void onError(int code) {
            listening = false;
            if (!hostActive || destroyed) return;
            if (code == SpeechRecognizer.ERROR_CLIENT && !wanted) return;

            if (usingOnDevice && Build.VERSION.SDK_INT >= 31
                    && (code == SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED || code == SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE)) {
                forcedSystemFallback = true;
                needsRebuild = false;
                createRecognizer(true);
                backoffUntil = SystemClock.elapsedRealtime() + 250L;
                error(code, "On-device language unavailable — using system speech");
                return;
            }

            handleRecoverableError(code);

            String message;
            switch (code) {
                case SpeechRecognizer.ERROR_AUDIO: message = "Audio input error — resetting"; break;
                case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: message = "Microphone permission denied"; break;
                case SpeechRecognizer.ERROR_NETWORK: message = "Speech network error"; break;
                case SpeechRecognizer.ERROR_NETWORK_TIMEOUT: message = "Speech network timeout"; break;
                case SpeechRecognizer.ERROR_NO_MATCH: message = "No speech match"; break;
                case SpeechRecognizer.ERROR_RECOGNIZER_BUSY: message = "Recognizer busy — cooling down"; break;
                case SpeechRecognizer.ERROR_SERVER: message = "Speech service error — resetting"; break;
                case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: message = "No speech heard"; break;
                default:
                    if (Build.VERSION.SDK_INT >= 31 && code == SpeechRecognizer.ERROR_TOO_MANY_REQUESTS) {
                        message = "Speech service rate limited — brief cooldown";
                    } else if (Build.VERSION.SDK_INT >= 31 && code == SpeechRecognizer.ERROR_SERVER_DISCONNECTED) {
                        message = "Speech service disconnected — resetting";
                    } else {
                        message = "Speech error " + code;
                    }
            }
            error(code, message);
        }
    }
}
