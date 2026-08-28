package tv.thefloor.voicetest;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String GAME_URL = "https://swoop081.github.io/the-floor/voice-test.html?v=0.3.3";

    private static final String TV_RUNTIME_FIX =
            "(function(){" +
            "var s=document.createElement('style');" +
            "s.textContent='.cover[hidden]{display:none!important}.center{min-height:0!important;overflow:hidden!important}.timerRow{min-height:7vh!important;flex:0 0 7vh!important}.voicebar{min-height:9vh!important;flex:0 0 9vh!important}footer{min-height:6vh!important;flex:0 0 6vh!important}.stage img[hidden],.prompt[hidden]{display:none!important}';" +
            "document.head.appendChild(s);" +
            "var food={" +
            "'pizza':'pizza','chicken-wings':'chicken wings|wings','grapes':'grapes|grape','cheese':'cheese','sushi':'sushi','steak':'steak','burger':'burger|hamburger|cheeseburger','croissant':'croissant','mushroom':'mushroom|mushrooms','sandwich':'sandwich','eggs':'eggs|egg','french-fries':'french fries|fries|chips','avocado':'avocado','banana':'banana','pineapple':'pineapple','coconut':'coconut','tomato':'tomato|tomatoes','onion':'onion|onions','potato':'potato|potatoes','baguette':'baguette|french bread','orange':'orange|oranges','kiwi':'kiwi|kiwi fruit','pear':'pear','bell-pepper':'bell pepper|capsicum|pepper','black-olives':'black olives|olives','bread':'bread','coffee-beans':'coffee beans|coffee','croissants':'croissants|croissant','mussels':'mussels|mussel','lime':'lime|limes'};" +
            "var nums={0:'zero',1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten',11:'eleven',12:'twelve',13:'thirteen',14:'fourteen',15:'fifteen',16:'sixteen',17:'seventeen',18:'eighteen',19:'nineteen',20:'twenty',21:'twenty one',22:'twenty two',23:'twenty three',24:'twenty four',25:'twenty five',30:'thirty',40:'forty'};" +
            "function sync(){" +
            "var label=document.getElementById('categoryLabel');if(label)label.textContent=label.textContent.replace(/v0\\.3\\.[0-9]+/,'v0.3.3');" +
            "if(!window.AndroidVoice||typeof window.AndroidVoice.setExpectedAnswers!=='function')return;" +
            "var hints='';var img=document.getElementById('clueImage');var txt=document.getElementById('textPrompt');" +
            "if(img&&!img.hidden&&img.getAttribute('src')){var m=img.getAttribute('src').match(/\\/([^\\/]+)\\.jpg(?:\\?|$)/);if(m){var k=m[1];hints=food[k]||k.replace(/-/g,' ');}}" +
            "else if(txt&&!txt.hidden){var q=(txt.textContent||'').replace(/\\s+/g,' ').trim();var mm=q.match(/^(\\d+)\\s*([+−×÷])\\s*(\\d+)$/);if(mm){var a=parseInt(mm[1]),b=parseInt(mm[3]),op=mm[2],n=op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b;hints=String(n)+(nums[n]?'|'+nums[n]:'');}}" +
            "try{window.AndroidVoice.setExpectedAnswers(hints);}catch(e){}" +
            "}" +
            "new MutationObserver(sync).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','src']});" +
            "setInterval(sync,700);sync();" +
            "})()";

    private WebView webView;
    private SpeechBridge speechBridge;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE);

        webView = new WebView(this);
        setContentView(webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setUserAgentString(settings.getUserAgentString() + " TheFloorTV/0.3.3");

        speechBridge = new SpeechBridge(this, webView);
        webView.addJavascriptInterface(speechBridge, "AndroidVoice");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String host = request.getUrl().getHost();
                return host == null || !host.equalsIgnoreCase("swoop081.github.io");
            }
            @Override public void onPageFinished(WebView view, String url) {
                speechBridge.pageReady();
                view.evaluateJavascript(TV_RUNTIME_FIX, null);
            }
        });
        webView.loadUrl(GAME_URL);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (speechBridge != null) speechBridge.hostResumed();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (speechBridge != null) speechBridge.hostPaused();
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onStop() {
        if (speechBridge != null) speechBridge.hostPaused();
        super.onStop();
    }

    @Override
    public void onUserLeaveHint() {
        if (speechBridge != null) speechBridge.hostPaused();
        super.onUserLeaveHint();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        speechBridge.onPermissionResult(requestCode, grantResults);
    }

    @Override
    protected void onDestroy() {
        if (speechBridge != null) speechBridge.destroy();
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
